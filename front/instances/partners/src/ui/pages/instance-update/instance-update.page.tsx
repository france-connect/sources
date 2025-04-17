import React from 'react';

import { EventTypes, HeadingTag } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { ExternalUrlsInterface } from '@fc/core-partners';
import { Options } from '@fc/core-partners';
import { AlertComponent, LinkComponent, Sizes } from '@fc/dsfr';
import { DTO2FormComponent } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { useInstanceUpdate } from '../../../hooks';

export const InstanceUpdatePage = React.memo(() => {
  const { initialValues, schema, submitHandler, title } = useInstanceUpdate();

  const { spConfigurationDocUrl } = ConfigService.get<ExternalUrlsInterface>(
    Options.CONFIG_EXTERNAL_URLS,
  );

  return (
    <React.Fragment>
      <h1 className="fr-col-12 fr-col-md-8">{t('Partners.updatepage.title')}</h1>
      <AlertComponent
        className="fr-col-12 fr-col-md-8 fr-mb-4w"
        size={Sizes.MEDIUM}
        title={t('Partners.instance.noticeTitle')}
        type={EventTypes.INFO}>
        <p>
          Consulter notre{' '}
          <LinkComponent
            dataTestId="documentation-partners-link"
            href={spConfigurationDocUrl}
            label="documentation partenaires"
            rel="noopener noreferrer external"
            target="_blank"
          />
        </p>
      </AlertComponent>
      <div className="fr-col-12 fr-col-md-8 fr-py-6w fc-grey-border--full">
        <div className="fr-col-offset-1 fr-col-10">
          <DTO2FormComponent
            config={{ id: 'DTO2Form-instance-update', title, titleHeading: HeadingTag.H2 }}
            initialValues={initialValues}
            schema={schema}
            submitLabel={t('Form.submit.label')}
            onSubmit={submitHandler}
          />
        </div>
      </div>
    </React.Fragment>
  );
});

InstanceUpdatePage.displayName = 'InstanceUpdatePage';
