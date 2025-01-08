export const isNotEmpty = (value: unknown | Array<unknown>) => {
  if (typeof value === 'string') {
    return !!value.trim();
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  const notEmpty = value !== null && value !== undefined;
  return notEmpty;
};
