export const isString = (value: unknown): boolean => {
  const result = typeof value === 'string' || value instanceof String;
  return result;
};
