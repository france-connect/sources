const DEFAULT_VISIBLE_CHARS = 8;
const ELLIPSIS = '...';

export const truncateMiddle = (
  value: string,
  visibleChars: number = DEFAULT_VISIBLE_CHARS,
): string => {
  const minLength = visibleChars * 2 + ELLIPSIS.length;

  if (value.length <= minLength) {
    return value;
  }

  return `${value.slice(0, visibleChars)}${ELLIPSIS}${value.slice(-visibleChars)}`;
};
