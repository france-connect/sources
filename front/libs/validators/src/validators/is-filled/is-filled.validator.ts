import { isNotEmpty } from '../is-not-empty';

export const isFilled = (fieldValue: string | string[]) => {
  const values = !Array.isArray(fieldValue) ? [fieldValue] : fieldValue;
  const notEmpty = values.every((v) => isNotEmpty(v));
  return notEmpty;
};
