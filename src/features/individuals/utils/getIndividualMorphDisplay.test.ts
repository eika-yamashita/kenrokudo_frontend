import { getIndividualMorphDisplay } from './getIndividualMorphDisplay';

describe('getIndividualMorphDisplay', () => {
  test('uses the bloodline name instead of the visual morph name', () => {
    expect(
      getIndividualMorphDisplay({
        morph_entries: [
          {
            morph_id: '010',
            morph_name: 'Raptor',
            bloodline_id: '001',
            bloodline_name: 'Bloodline A',
            expression_category: '0',
          },
          {
            morph_id: '020',
            morph_name: 'Zulu',
            expression_category: '1',
          },
        ],
      })
    ).toBe('Bloodline A het Zulu');
  });

  test('uses the morph name when no bloodline is registered', () => {
    expect(
      getIndividualMorphDisplay({
        morph_entries: [
          {
            morph_id: '010',
            morph_name: 'Raptor',
            expression_category: '0',
          },
        ],
      })
    ).toBe('Raptor');
  });
});
