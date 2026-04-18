import { render, screen, within } from '@testing-library/react';
import { IndividualListScreen } from './IndividualListScreen';

const mockNavigate = jest.fn();
const mockSetSearchParams = jest.fn();
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
        morph: 'Mack Snow',
        gender_category: '1',
        create_user: 'system',
        create_at: '2026-04-08T10:15',
      },
    ],
  }),
}));

jest.mock('../components/IndividualThumbnailCell', () => ({
  IndividualThumbnailCell: () => <span>thumb</span>,
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
  });
});
