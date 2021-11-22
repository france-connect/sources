export const ucfirst = (str: string): string => {
  const firstChar = str.charAt(0).toUpperCase();
  const othersChars = str.slice(1);
  return `${firstChar}${othersChars}`;
};
