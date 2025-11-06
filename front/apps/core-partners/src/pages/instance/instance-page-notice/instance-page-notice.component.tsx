import React from 'react';

import { MessageTypes, Strings } from '@fc/common';
import { ConfigService } from '@fc/config';
import { AlertComponent, Sizes } from '@fc/dsfr';
import { SeeAlsoElement } from '@fc/forms';
import { t } from '@fc/i18n';

import { CorePartnersOptions } from '../../../enums';
import type { ExternalUrlsInterface } from '../../../interfaces';

export const InstancePageNoticeComponent = React.memo(() => {
  const { configurationSandboxAddressDocUrl } = ConfigService.get<ExternalUrlsInterface>(
    CorePartnersOptions.CONFIG_EXTERNAL_URLS,
  );

  return (
    <AlertComponent
      className="fr-col-12 fr-col-md-8 fr-mb-4w"
      size={Sizes.MEDIUM}
      type={MessageTypes.INFO}>
      <h3 className="fr-alert__title">
        {t('CorePartners.instance.noticeTitle')}
        {Strings.WHITE_SPACE}
        <SeeAlsoElement id="alert-partner-doc" url={configurationSandboxAddressDocUrl} />
      </h3>
    </AlertComponent>
  );
});

InstancePageNoticeComponent.displayName = 'InstancePageNoticeComponent';
