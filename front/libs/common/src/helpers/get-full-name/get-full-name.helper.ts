import { Strings } from '../../enums';

export const getFullName = (firstname?: string, lastname?: string) => {
  const result = [firstname, lastname].filter(Boolean);

  if (!result.length) {
    return undefined;
  }
  return result.join(Strings.WHITE_SPACE);
};
