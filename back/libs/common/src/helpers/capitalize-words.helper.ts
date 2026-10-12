export const capitalizeWords = (words = ''): string => {
  return words
    .trim()
    .toLowerCase()
    .replace(/(?<![\p{L}\p{N}])\p{L}/gu, (char) => char.toUpperCase());
};
