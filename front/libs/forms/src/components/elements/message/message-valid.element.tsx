import React from 'react';

import { t } from '@fc/i18n';

interface MessageValidElementProps {
  id: string;
  dataTestId?: string;
}

export const MessageValidElement = React.memo(
  ({ dataTestId = undefined, id }: MessageValidElementProps) => (
    <p className="fr-valid-text" data-testid={dataTestId} id={`${id}-messages`}>
      {t('Form.message.valid')}
    </p>
  ),
);

MessageValidElement.displayName = 'MessageValidElement';
