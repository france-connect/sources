import { Strings } from '../../../enums';

const DEFAULT_VISIBLE_CHARS = 8;

export const truncateMiddle = (
  value: string,
  visibleChars: number = DEFAULT_VISIBLE_CHARS,
): string => {
  const minLength = visibleChars * 2 + Strings.ELLIPSIS.length;

  if (value.length <= minLength) {
    return value;
  }

  return `${value.slice(0, visibleChars)}${Strings.ELLIPSIS}${value.slice(-visibleChars)}`;
};
