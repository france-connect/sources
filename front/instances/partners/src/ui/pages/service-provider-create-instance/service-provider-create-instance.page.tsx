import React from 'react';

import { InstancePageFormComponent, InstancePageHeaderComponent } from '@fc/core-partners';
import { t } from '@fc/i18n';

import { useServiceProviderCreateInstance } from '../../../hooks';

export const ServiceProviderCreateInstancePage = React.memo(() => {
  const { config, initialValues, postSubmit, preSubmit, schema, submitHandler } =
    useServiceProviderCreateInstance();

  const pageTitle = t('Partners.serviceProvider.createInstance.title');
  const pageIntro = t('Partners.serviceProvider.createInstance.description');
  return (
    <React.Fragment>
      <InstancePageHeaderComponent intro={pageIntro} title={pageTitle} />
      <InstancePageFormComponent
        config={config}
        initialValues={initialValues}
        postSubmit={postSubmit}
        preSubmit={preSubmit}
        schema={schema}
        submitHandler={submitHandler}
      />
    </React.Fragment>
  );
});

ServiceProviderCreateInstancePage.displayName = 'ServiceProviderCreateInstancePage';
