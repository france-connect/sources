import diacritics from 'diacritics';

export const getSlugFromSearchTerm = (term: string): string => {
  if (!term.trim()) return term;
  return diacritics.remove(term);
};
