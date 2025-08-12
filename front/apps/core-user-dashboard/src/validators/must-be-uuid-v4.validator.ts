import validator from 'validator';

export const mustBeUUIDv4 = () => (value?: string) => {
  if (!value) return undefined;
  const isValid = validator.isUUID(value, '4');
  return isValid ? undefined : 'Le code est erroné, veuillez vérifier sa valeur';
};
