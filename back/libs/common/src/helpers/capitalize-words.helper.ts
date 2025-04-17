export const capitalizeWords = (words = ''): string => {
  return words
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
