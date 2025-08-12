import React from 'react';

import { t } from '@fc/i18n';

interface SeeAlsoElementProps {
  url?: string;
  id: string;
  dataTestId?: string;
}

export const SeeAlsoElement = React.memo(
  ({ dataTestId, id, url }: SeeAlsoElementProps) =>
    url && (
      <a
        className="fr-link"
        data-testid={dataTestId}
        href={url}
        id={`${id}-see-also`}
        rel="noopener external noreferrer"
        target="_blank">
        {t('Form.label.seeAlso')}
      </a>
    ),
);

SeeAlsoElement.displayName = 'SeeAlsoElement';
