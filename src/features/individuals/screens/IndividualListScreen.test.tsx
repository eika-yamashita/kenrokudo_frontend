import { fireEvent, render, screen, within } from '@testing-library/react';
import { IndividualListScreen } from './IndividualListScreen';

const mockNavigate = jest.fn();
const mockSetSearchParams = jest.fn();
const mockDownloadIndividualCsv = jest.fn();
const mockSearchParams = new URLSearchParams('speciesId=leo&fiscalYear=2026');

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: '?speciesId=leo&fiscalYear=2026' }),
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}), { virtual: true });

jest.mock('../../species/hooks/useSpeciesQuery', () => ({
  useSpeciesQuery: () => ({
    isLoading: false,
    error: null,
    data: [{ species_id: 'leo', japanese_name: 'レオパ', common_name: 'Leopard Gecko' }],
  }),
}));

jest.mock('../hooks/useIndividualQueries', () => ({
  useIndividualSearchQuery: () => ({
    isLoading: false,
    error: null,
    data: [
      {
        species_id: 'leo',
        id: 'A1',
        morph_entries: [
          {
            morph_id: '001',
            morph_name: 'Mack Snow',
            expression_category: '0',
            sort_order: 0,
          },
        ],
        gender_category: '1',
        sales_price_tax_in: 1234567,
        create_user: 'system',
        create_at: '2026-04-08T10:15',
      },
    ],
  }),
}));

jest.mock('../components/IndividualThumbnailCell', () => ({
  IndividualThumbnailCell: () => <span>thumb</span>,
}));

jest.mock('../utils/individualCsv', () => ({
  downloadIndividualCsv: (...args: unknown[]) => mockDownloadIndividualCsv(...args),
}));

describe('IndividualListScreen', () => {
  it('does not render a species column in the list', () => {
    mockNavigate.mockReset();
    mockSetSearchParams.mockReset();

    render(
      <IndividualListScreen />
    );

    const table = screen.getByRole('table');
    expect(within(table).queryByText('種名')).not.toBeInTheDocument();
    expect(within(table).queryByText('Leopard Gecko')).not.toBeInTheDocument();
    expect(within(table).getByText('個体ID')).toBeInTheDocument();
    expect(within(table).getByText('Mack Snow')).toBeInTheDocument();
    expect(within(table).getByText('金額')).toBeInTheDocument();
    expect(within(table).getByText('1,234,567')).toBeInTheDocument();
  });

  it('selects an individual without opening its detail and exports it as CSV', () => {
    mockNavigate.mockReset();
    mockDownloadIndividualCsv.mockReset();

    render(<IndividualListScreen />);

    const exportButton = screen.getByRole('button', { name: 'CSV出力（0件）' });
    expect(exportButton).toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox', { name: 'A1を選択' }));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'CSV出力（1件）' })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'CSV出力（1件）' }));

    expect(mockDownloadIndividualCsv).toHaveBeenCalledWith([
      expect.objectContaining({ species_id: 'leo', id: 'A1' }),
    ]);
  });

  it('selects and clears every displayed individual from the header checkbox', () => {
    render(<IndividualListScreen />);

    const selectAll = screen.getByRole('checkbox', { name: '表示中の個体をすべて選択' });
    fireEvent.click(selectAll);
    expect(screen.getByRole('checkbox', { name: 'A1を選択' })).toBeChecked();
    expect(screen.getByRole('button', { name: 'CSV出力（1件）' })).toBeEnabled();

    fireEvent.click(selectAll);
    expect(screen.getByRole('checkbox', { name: 'A1を選択' })).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'CSV出力（0件）' })).toBeDisabled();
  });
});
