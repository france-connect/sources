export const mustBePhone = () => (value?: string) => {
  if (!value) return undefined;
  const isValid = value.match(/^[-0-9\-.+( )]+$/);
  return isValid
    ? undefined
    : 'Le format du numéro téléphone saisi n’est pas valide. Le format attendu est : (+33) 2 43 55 55 55 ou 01 22 33 44 55';
};
