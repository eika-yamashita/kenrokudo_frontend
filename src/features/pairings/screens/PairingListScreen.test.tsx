import { fireEvent, render, screen, within } from '@testing-library/react';
import { PairingListScreen } from './PairingListScreen';

const mockNavigate = jest.fn();
const mockSetSearchParams = jest.fn();
const mockSearchParams = new URLSearchParams('speciesId=leo&fiscalYear=2026');

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/admin/pairings', search: '?speciesId=leo&fiscalYear=2026' }),
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}), { virtual: true });

jest.mock('../../species/hooks/useSpeciesQuery', () => ({
  useSpeciesQuery: () => ({
    isLoading: false,
    error: null,
    data: [{ species_id: 'leo', japanese_name: 'レオパ', common_name: 'Leopard Gecko' }],
  }),
}));

jest.mock('../hooks/usePairingQueries', () => ({
  usePairingSearchQuery: () => ({
    isLoading: false,
    error: null,
    data: [
      {
        species_id: 'leo',
        fiscal_year: 2026,
        pairing_id: 'P1',
        male_parent_id: 'M1',
        female_parent_id: 'F1',
        pairing_date: '2026-04-08',
      },
    ],
  }),
}));

describe('PairingListScreen', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockSetSearchParams.mockReset();
  });

  it('shows the compact ID header and opens the detail screen from a row', () => {
    render(<PairingListScreen />);

    const table = screen.getByRole('table');
    expect(within(table).getByText('ID')).toBeInTheDocument();
    expect(within(table).queryByText('ペアリングID')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /P1/ }));

    expect(mockNavigate).toHaveBeenCalledWith(
      '/admin/pairings/detail/leo/2026/P1?speciesId=leo&fiscalYear=2026'
    );
  });
});
