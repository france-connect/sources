const isSearchTermValid = (term: string | undefined): boolean => {
  if (!term || typeof term !== 'string') {
    return false;
  }
  const trimmed = term.trim();
  return trimmed !== '';
};

export default isSearchTermValid;
