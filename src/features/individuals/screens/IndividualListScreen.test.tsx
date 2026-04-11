import { render, screen } from '@testing-library/react';
import { IndividualListScreen } from './IndividualListScreen';

const mockNavigate = jest.fn();

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

jest.mock('../hooks/useIndividualQueries', () => ({
  useIndividualsQuery: () => ({
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
  it('renders cached species labels in the list', () => {
    render(
      <IndividualListScreen />
    );

    expect(screen.getByText('Leopard Gecko')).toBeInTheDocument();
    expect(screen.getByText('Mack Snow')).toBeInTheDocument();
  });
});
