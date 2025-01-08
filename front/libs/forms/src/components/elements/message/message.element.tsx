import React from 'react';

import { t } from '@fc/i18n';

interface MessageElementProps {
  error?: string | undefined;
  id: string;
  isValid?: boolean;
}

export const MessageElement = React.memo(
  ({ error = undefined, id, isValid = false }: MessageElementProps) => (
    <div aria-live="assertive" className="fr-messages-group" id={id}>
      {isValid && (
        <p className="fr-valid-text" id={`${id}-messages`}>
          {t('Form.message.valid')}
        </p>
      )}
      {!!error && (
        <p className="fr-message fr-message--error" id={`${id}-messages`}>
          {error}
        </p>
      )}
    </div>
  ),
);

MessageElement.displayName = 'MessageElement';
