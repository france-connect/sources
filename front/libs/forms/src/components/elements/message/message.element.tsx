import React from 'react';

import { ConfigService } from '@fc/config';
import type { DTO2FormConfig } from '@fc/dto2form';

import { MessageErrorElement } from './message-error.element';
import { MessageValidElement } from './message-valid.element';

interface MessageElementProps {
  error?: string | string[];
  id: string;
  dataTestId?: string;
  isValid?: boolean;
}

export const MessageElement = React.memo(
  ({ dataTestId = undefined, error = undefined, id, isValid = false }: MessageElementProps) => {
    const { showFieldValidationMessage } = ConfigService.get<DTO2FormConfig>('DTO2Form');

    const showErrorMessage = !!error;
    const showValidationMessage = showFieldValidationMessage && isValid;

    return (
      <div aria-live="assertive" className="fr-messages-group" id={id}>
        {showValidationMessage && <MessageValidElement dataTestId={dataTestId} id={id} />}
        {showErrorMessage && <MessageErrorElement dataTestId={dataTestId} error={error} id={id} />}
      </div>
    );
  },
);

MessageElement.displayName = 'MessageElement';
