export const validateCheckbox = (value?: boolean) => {
  const msg = 'Veuillez cocher cette case si vous souhaitez continuer';
  return !value ? msg : undefined;
};
