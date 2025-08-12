import validator from 'validator';

export const mustBeEmail = () => (value?: string) => {
  if (!value) return undefined;
  const isValid = validator.isEmail(value);
  return isValid ? undefined : 'Veuillez saisir une adresse électronique valide';
};
