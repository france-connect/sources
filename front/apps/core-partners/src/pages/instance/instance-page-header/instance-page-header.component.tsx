import React from 'react';

import { Strings } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { CorePartnersOptions } from '../../../enums';
import type { ExternalUrlsInterface } from '../../../interfaces';

interface InstancePageHeaderComponentProps {
  title: string;
  intro: string;
}

export const InstancePageHeaderComponent = React.memo(
  ({ intro, title }: InstancePageHeaderComponentProps) => {
    const { spConfigurationDocUrl } = ConfigService.get<ExternalUrlsInterface>(
      CorePartnersOptions.CONFIG_EXTERNAL_URLS,
    );

    return (
      <React.Fragment>
        <h1 className="fr-col-12 fr-col-md-8">{title}</h1>
        <div className="fr-col-12 fr-col-md-8">
          <p>
            {intro}
            {Strings.WHITE_SPACE}
            <LinkComponent
              external
              dataTestId="documentation-partners-link"
              href={spConfigurationDocUrl}
              label={t('CorePartners.documentation.label')}
            />
          </p>
        </div>
      </React.Fragment>
    );
  },
);

InstancePageHeaderComponent.displayName = 'InstancePageHeaderComponent';
