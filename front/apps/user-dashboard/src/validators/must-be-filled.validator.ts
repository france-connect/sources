export const mustBeFilled = (message?: string) => (value?: string) => {
  const msg = message || 'Ce champ est obligatoire';
  if (!value) {
    return msg;
  }
  return value.trim() ? undefined : msg;
};
