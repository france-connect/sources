import React from 'react';
import { useLoaderData } from 'react-router';

import { EventTypes } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { ExternalUrlsInterface } from '@fc/core-partners';
import { Options } from '@fc/core-partners';
import { AlertComponent, LinkComponent, Sizes } from '@fc/dsfr';
import type { Dto2FormConfigInterface } from '@fc/dto2form';
import { DTO2FormComponent, removeEmptyValues, useDto2Form } from '@fc/dto2form';
import { SeeAlsoElement } from '@fc/forms';
import { t } from '@fc/i18n';

import { SubmitTypes, SubmitTypesMessage } from '../../../enums';
import { usePostSubmit } from '../../../hooks';

export const InstanceUpdatePage = React.memo(() => {
  const { InstancesUpdate } = ConfigService.get<Dto2FormConfigInterface>('Dto2Form');

  const { spConfigurationDocUrl } = ConfigService.get<ExternalUrlsInterface>(
    Options.CONFIG_EXTERNAL_URLS,
  );
  const response = useLoaderData();
  const { initialValues, schema, submitHandler } = useDto2Form(InstancesUpdate);

  const { name: title } = response || {};

  const postSubmit = usePostSubmit(SubmitTypesMessage.INSTANCE_SUCCESS_UPDATE, SubmitTypes.SUCCESS);

  return (
    <React.Fragment>
      <h1 className="fr-col-12 fr-col-md-8">{t('Partners.updatepage.title')}</h1>
      <div className="fr-col-12 fr-col-md-8">
        <p>
          {t('Partners.instance.updateIntro')}{' '}
          <LinkComponent
            external
            dataTestId="documentation-partners-link"
            href={spConfigurationDocUrl}
            label="documentation partenaires"
          />
        </p>
      </div>
      <AlertComponent
        className="fr-col-12 fr-col-md-8 fr-mb-4w"
        size={Sizes.MEDIUM}
        type={EventTypes.INFO}>
        <h3 className="fr-alert__title">
          {t('Partners.instance.noticeTitle')}{' '}
          <SeeAlsoElement
            id="alert-partner-doc"
            url="https://docs.partenaires.franceconnect.gouv.fr/fs/fs-integration/env-sandbox-fc/#configuration-des-adresses-du-bac-a-sable"
          />
        </h3>
      </AlertComponent>
      <div className="fr-col-12 fr-col-md-8 fr-py-6w fc-grey-border--full">
        <div className="fr-col-offset-1 fr-col-10">
          <DTO2FormComponent
            config={{
              ...InstancesUpdate,
              title,
            }}
            initialValues={initialValues}
            schema={schema}
            submitLabel={t('Form.submit.label')}
            onPostSubmit={postSubmit}
            onPreSubmit={removeEmptyValues}
            onSubmit={submitHandler}
          />
        </div>
      </div>
    </React.Fragment>
  );
});

InstanceUpdatePage.displayName = 'InstanceUpdatePage';
