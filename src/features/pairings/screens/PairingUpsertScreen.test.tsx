import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PairingUpsertScreen } from './PairingUpsertScreen';

const mockNavigate = jest.fn();
const mockCreateMutation = jest.fn();

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

jest.mock('../../individuals/hooks/useIndividualQueries', () => ({
  useIndividualsQuery: () => ({
    isLoading: false,
    error: null,
    data: [
      { species_id: 'leo', id: 'M1', gender_category: '1', create_user: 'system', create_at: '2026-04-08T10:15' },
      { species_id: 'leo', id: 'F1', gender_category: '2', create_user: 'system', create_at: '2026-04-08T10:15' },
    ],
  }),
}));

jest.mock('../hooks/usePairingQueries', () => ({
  usePairingQuery: () => ({
    isLoading: false,
    error: null,
    data: null,
  }),
  useCreatePairingMutation: () => ({
    isPending: false,
    error: null,
    mutateAsync: mockCreateMutation,
  }),
  useUpdatePairingMutation: () => ({
    isPending: false,
    error: null,
    mutateAsync: jest.fn(),
  }),
  useDeletePairingMutation: () => ({
    isPending: false,
    error: null,
    mutateAsync: jest.fn(),
  }),
}));

describe('PairingUpsertScreen', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockCreateMutation.mockReset();
    mockCreateMutation.mockResolvedValue({});
  });

  it('submits a create form with selected parent ids', async () => {
    render(<PairingUpsertScreen mode="create" />);

    await userEvent.type(screen.getByLabelText('オス親ID'), 'M1');
    await userEvent.type(screen.getByLabelText('メス親ID'), 'F1');
    await userEvent.clear(screen.getByLabelText('ペアリング日'));
    await userEvent.type(screen.getByLabelText('ペアリング日'), '2026-04-08');
    await userEvent.click(screen.getByRole('button', { name: '保存' }));

    await waitFor(() => expect(mockCreateMutation).toHaveBeenCalled());
    expect(mockCreateMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        species_id: 'leo',
        male_parent_id: 'M1',
        female_parent_id: 'F1',
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/admin/pairings?speciesId=leo&fiscalYear=2026');
  });
});
