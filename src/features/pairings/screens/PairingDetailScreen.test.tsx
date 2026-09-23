import { fireEvent, render, screen } from '@testing-library/react';
import { PairingDetailScreen } from './PairingDetailScreen';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: '?speciesId=leo&fiscalYear=2026' }),
}), { virtual: true });

jest.mock('../../species/hooks/useSpeciesQuery', () => ({
  useSpeciesQuery: () => ({
    isLoading: false,
    error: null,
    data: [{ species_id: 'leo', japanese_name: 'レオパ', common_name: 'Leopard Gecko' }],
  }),
}));

jest.mock('../hooks/usePairingQueries', () => ({
  usePairingQuery: () => ({
    isLoading: false,
    error: null,
    data: {
      species_id: 'leo',
      fiscal_year: 2026,
      pairing_id: 'P1',
      male_parent_id: 'M1',
      female_parent_id: 'F1',
      pairing_date: '2026-04-08',
      note: '確認用メモ',
    },
  }),
}));

describe('PairingDetailScreen', () => {
  beforeEach(() => mockNavigate.mockReset());

  it('shows pairing information and preserves the list search when navigating', () => {
    render(<PairingDetailScreen speciesId="leo" fiscalYear={2026} pairingId="P1" />);

    expect(screen.getByText('ペアリング / P1')).toBeInTheDocument();
    expect(screen.getByText('Leopard Gecko')).toBeInTheDocument();
    expect(screen.getByText('M1')).toBeInTheDocument();
    expect(screen.getByText('F1')).toBeInTheDocument();
    expect(screen.getByText('確認用メモ')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '編集' }));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/admin/pairings/edit/leo/2026/P1?speciesId=leo&fiscalYear=2026'
    );
  });
});
