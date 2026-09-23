import { fireEvent, render, screen } from '@testing-library/react';
import { PairingDetailScreen } from './PairingDetailScreen';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: '/admin/pairings/detail/leo/2026/P1',
    search: '?speciesId=leo&fiscalYear=2026',
  }),
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

jest.mock('../../individuals/hooks/useIndividualQueries', () => ({
  useIndividualQuery: (_speciesId: string, id: string) => ({
    isLoading: false,
    error: null,
    data: {
      species_id: 'leo',
      fiscal_year: 2026,
      id,
      morph_entries: [
        {
          morph_id: id === 'M1' ? '001' : '002',
          morph_name: id === 'M1' ? 'Mack Snow' : 'Tremper Albino',
          expression_category: '0',
          sort_order: 0,
        },
      ],
    },
  }),
  useIndividualImagesQuery: (_speciesId: string, id: string) => ({
    isLoading: false,
    error: null,
    data: [{ image_id: id === 'M1' ? 1 : 2, public_url: `/${id}.jpg`, is_primary: true }],
  }),
}));

describe('PairingDetailScreen', () => {
  beforeEach(() => mockNavigate.mockReset());

  it('shows pairing information and preserves the list search when navigating', () => {
    render(<PairingDetailScreen speciesId="leo" fiscalYear={2026} pairingId="P1" />);

    expect(screen.getByText('ペアリング / P1')).toBeInTheDocument();
    expect(screen.getByText('Leopard Gecko')).toBeInTheDocument();
    expect(screen.getAllByText('M1')).toHaveLength(2);
    expect(screen.getAllByText('F1')).toHaveLength(2);
    expect(screen.getByRole('img', { name: 'オス親 M1' })).toHaveAttribute('src', '/M1.jpg');
    expect(screen.getByRole('img', { name: 'メス親 F1' })).toHaveAttribute('src', '/F1.jpg');
    expect(screen.getByText('Mack Snow')).toBeInTheDocument();
    expect(screen.getByText('Tremper Albino')).toBeInTheDocument();
    expect(screen.getByText('確認用メモ')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '編集' }));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/admin/pairings/edit/leo/2026/P1?speciesId=leo&fiscalYear=2026'
    );
  });

  it('opens an individual detail and passes the pairing detail as its return destination', () => {
    render(<PairingDetailScreen speciesId="leo" fiscalYear={2026} pairingId="P1" />);

    fireEvent.click(screen.getByRole('button', { name: 'M1' }));

    expect(mockNavigate).toHaveBeenCalledWith('/admin/individuals/detail/leo/M1', {
      state: {
        returnTo: '/admin/pairings/detail/leo/2026/P1?speciesId=leo&fiscalYear=2026',
      },
    });
  });
});
