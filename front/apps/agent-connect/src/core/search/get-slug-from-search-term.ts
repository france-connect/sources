import diacritics from 'diacritics';

const getSlugFromSearchTerm = (term: string): string => {
  if (!term.trim()) return term;
  return diacritics.remove(term);
};

export default getSlugFromSearchTerm;
