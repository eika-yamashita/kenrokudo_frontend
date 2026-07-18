import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IndividualCreateScreen } from './IndividualCreateScreen';

const mockNavigate = jest.fn();
const mockCreateMutation = jest.fn();
const mockUploadMutation = jest.fn();

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
      {
        species_id: 'leo',
        fiscal_year: 2025,
        pairing_id: 'B',
        male_parent_id: 'M2',
        female_parent_id: 'F2',
        pairing_date: '2025-04-08',
      },
    ],
  }),
}));

jest.mock('../../morphs/hooks/useMorphQueries', () => ({
  useMorphsQuery: () => ({
    isLoading: false,
    error: null,
    data: [
      { species_id: 'leo', morph_id: '001', morph_name: 'Mack Snow', inheritance_category: '0' },
      { species_id: 'leo', morph_id: '002', morph_name: 'Bell Albino', inheritance_category: '1' },
    ],
  }),
}));

jest.mock('../../bloodlines/hooks/useBloodlineQueries', () => ({
  useBloodlinesQuery: () => ({
    isLoading: false,
    error: null,
    data: [
      { species_id: 'leo', morph_id: '001', bloodline_id: '001', bloodline_name: 'US Line' },
      { species_id: 'leo', morph_id: '002', bloodline_id: '001', bloodline_name: 'EU Line' },
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
    window.confirm = jest.fn(() => true);
  });

  it('submits the form and uploads selected images', async () => {
    render(<IndividualCreateScreen />);

    await userEvent.clear(screen.getByLabelText('個体ID'));
    await userEvent.type(screen.getByLabelText('個体ID'), 'a1');
    await userEvent.selectOptions(screen.getByLabelText('モルフ'), '001');
    await userEvent.selectOptions(screen.getByLabelText('ペアリングID'), '2026|A');

    const file = new File(['binary'], 'gecko.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, file);
    await userEvent.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => expect(mockCreateMutation).toHaveBeenCalled());
    expect(mockUploadMutation).toHaveBeenCalledWith({
      speciesId: 'leo',
      id: 'A1',
      file,
      isPrimary: true,
    });
    expect(mockNavigate).toHaveBeenCalledWith('/admin/individuals?speciesId=leo&fiscalYear=2026');
  });

  it('clears hatch date when purchase individual is selected', async () => {
    render(<IndividualCreateScreen />);

    const hatchDateInput = screen.getByLabelText('ハッチ日') as HTMLInputElement;
    expect(hatchDateInput.value).not.toBe('');

    await userEvent.selectOptions(screen.getByLabelText('繁殖区分'), '1');

    await waitFor(() => expect(hatchDateInput.value).toBe(''));
  });

  it('allows self-breeding registration before pairing information is selected', async () => {
    render(<IndividualCreateScreen />);

    const pairingFiscalYear = screen.getByLabelText('ペアリング年度') as HTMLSelectElement;
    expect(pairingFiscalYear.value).toBe('');
    expect(screen.getByRole('option', { name: /2026 \/ A/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /2025 \/ B/ })).toBeInTheDocument();

    await userEvent.selectOptions(pairingFiscalYear, '2025');
    await waitFor(() => expect(pairingFiscalYear.value).toBe('2025'));

    expect(screen.getByRole('option', { name: /2025 \/ B/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /2026 \/ A/ })).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('繁殖区分'), '1');
    expect(screen.queryByLabelText('ペアリング年度')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('ペアリングID')).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('繁殖区分'), '0');
    await waitFor(() => expect((screen.getByLabelText('ペアリング年度') as HTMLSelectElement).value).toBe(''));
    const pairingIdSelect = screen.getByText('ペアリングID').closest('label')?.querySelector('select');
    expect(pairingIdSelect).toHaveValue('');
  });

  it('adds another het row after selecting the current last het row', async () => {
    render(<IndividualCreateScreen />);

    expect(screen.queryByLabelText('ヘテロ2')).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('ヘテロ'), '002');

    expect(await screen.findByLabelText('ヘテロ2')).toBeInTheDocument();
  });
});
