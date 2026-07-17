import type { Individual } from '../../../api/models/Individual';
import type { IndividualMorph } from '../../../api/models/IndividualMorph';

const EXPRESSION_VISUAL = '0';
const EXPRESSION_HET = '1';
const EXPRESSION_POSSIBLE_HET = '2';

const bySortOrder = (a: IndividualMorph, b: IndividualMorph) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

export const getIndividualMorphDisplay = (individual: Pick<Individual, 'morph_entries'>) => {
  const entries = individual.morph_entries ?? [];
  if (entries.length === 0) {
    return '';
  }

  const visual = entries.find((entry) => entry.expression_category === EXPRESSION_VISUAL);
  const parts: string[] = [];
  if (visual?.morph_name) {
    parts.push(visual.bloodline_name || visual.morph_name);
  }

  entries
    .filter((entry) => entry.expression_category === EXPRESSION_HET)
    .sort(bySortOrder)
    .forEach((entry) => {
      if (entry.morph_name) {
        parts.push(`het ${entry.morph_name}`);
      }
    });

  entries
    .filter((entry) => entry.expression_category === EXPRESSION_POSSIBLE_HET)
    .sort(bySortOrder)
    .forEach((entry) => {
      if (entry.morph_name) {
        const percentage = entry.possible_het_percentage;
        parts.push(`poss het ${entry.morph_name}${percentage === undefined ? '' : ` ${percentage}%`}`);
      }
    });

  return parts.join(' ');
};
