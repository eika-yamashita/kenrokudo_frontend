import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IndividualCreateScreen } from './IndividualCreateScreen';

const mockNavigate = jest.fn();
const mockCreateMutation = jest.fn();
const mockUploadMutation = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

jest.mock('../../species/hooks/useSpeciesQuery', () => ({
  useSpeciesQuery: () => ({
    isLoading: false,
    error: null,
    data: [{ species_id: 'leo', japanese_name: 'レオパ', common_name: 'Leopard Gecko' }],
  }),
}));

jest.mock('../../pairings/hooks/usePairingQueries', () => ({
  usePairingsQuery: () => ({
    isLoading: false,
    error: null,
    data: [
      {
        species_id: 'leo',
        fiscal_year: 2026,
        pairing_id: 'A',
        male_parent_id: 'M1',
        female_parent_id: 'F1',
        pairing_date: '2026-04-08',
      },
    ],
  }),
}));

jest.mock('../hooks/useIndividualQueries', () => ({
  useCreateIndividualMutation: () => ({
    isPending: false,
    error: null,
    mutateAsync: mockCreateMutation,
  }),
  useUploadIndividualImageMutation: () => ({
    isPending: false,
    error: null,
    mutateAsync: mockUploadMutation,
  }),
}));

describe('IndividualCreateScreen', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockCreateMutation.mockReset();
    mockUploadMutation.mockReset();
    mockCreateMutation.mockResolvedValue({
      species_id: 'leo',
      id: 'A1',
    });
    mockUploadMutation.mockResolvedValue({});
    global.URL.createObjectURL = jest.fn(() => 'blob:preview');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('submits the form and uploads selected images', async () => {
    render(<IndividualCreateScreen />);

    await userEvent.clear(screen.getByLabelText('個体ID'));
    await userEvent.type(screen.getByLabelText('個体ID'), 'a1');
    await userEvent.selectOptions(screen.getByLabelText('ペアリングID'), '2026|A');

    const file = new File(['binary'], 'gecko.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText('画像ファイル'), file);
    await userEvent.click(screen.getByRole('button', { name: '登録する' }));

    await waitFor(() => expect(mockCreateMutation).toHaveBeenCalled());
    expect(mockUploadMutation).toHaveBeenCalledWith({
      speciesId: 'leo',
      id: 'A1',
      file,
      isPrimary: true,
    });
    expect(mockNavigate).toHaveBeenCalledWith('/admin/individuals');
  });
});
