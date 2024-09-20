import { Strings } from '../../enums';

/**
 * @description This helper allows you to set a title for an HTML page
 * or the accessible title of HTML links.
 * It is useful for improving the accessibility for people with disabilities,
 * such as screen reader users.
 */
export const getAccessibleTitle = (...args: (string | undefined)[]): string | undefined => {
  const result = args
    .filter(Boolean)
    .join(`${Strings.WHITE_SPACE}${Strings.DASH}${Strings.WHITE_SPACE}`);
  return result || undefined;
};
