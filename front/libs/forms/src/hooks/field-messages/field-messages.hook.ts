import { EventTypes, useSafeContext } from '@fc/common';
import { t } from '@fc/i18n';

import { FormConfigContext } from '../../context';
import type { FieldMessage } from '../../interfaces';

interface FieldMessagesProps {
  messages?: FieldMessage[];
  errorsList?: FieldMessage[];
  isValid?: boolean;
}

export const useFieldMessages = ({
  errorsList = [],
  isValid = false,
  messages = [],
}: FieldMessagesProps): FieldMessage[] => {
  const { showFieldValidationMessage } = useSafeContext(FormConfigContext);

  const showValidMessage = showFieldValidationMessage && isValid;

  /**
   * @TODO to refacto when success message is returned by the backend
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2288
   */
  const validMessage = showValidMessage
    ? {
        content: t('Form.message.valid'),
        level: EventTypes.VALID,
        priority: 30,
      }
    : undefined;

  const fieldMessages: FieldMessage[] = [
    ...errorsList,
    ...messages,
    ...(validMessage ? [validMessage] : []),
  ];

  return fieldMessages;
};
