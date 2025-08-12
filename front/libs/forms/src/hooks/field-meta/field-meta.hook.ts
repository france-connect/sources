import classnames from 'classnames';
import type { FieldMetaState } from 'react-final-form';

export const useFieldMeta = (meta: FieldMetaState<string>) => {
  const { error, invalid, pristine, submitError, touched, valid } = meta;

  const hasError = !!(touched && invalid);
  const isValid = !!(touched && valid && !pristine);
  const rawError = hasError ? error || submitError : [];

  const errorsList = !Array.isArray(rawError) ? [rawError] : rawError;

  const inputClassname = classnames('fr-input', {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'fr-input--error': hasError,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'fr-input--valid': isValid,
  });

  return {
    errorsList,
    hasError,
    inputClassname,
    isValid,
  };
};
