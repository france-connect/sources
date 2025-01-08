import classnames from 'classnames';
import type { FieldMetaState } from 'react-final-form';

import type { InputMetaInterface } from '../../interfaces';

export const useFieldMeta = <FieldValue = string>(
  meta: FieldMetaState<FieldValue>,
): InputMetaInterface => {
  const hasError = !!(meta.touched && meta.error);
  const isValid = !!(meta.touched && !meta.error);
  const errorMessage = hasError ? meta.error : undefined;

  const inputClassname = classnames(`fr-input`, {
    [`fr-input--error`]: hasError,
    [`fr-input--valid`]: isValid,
  });

  const fieldProps = { errorMessage, hasError, inputClassname, isValid };

  return fieldProps;
};
