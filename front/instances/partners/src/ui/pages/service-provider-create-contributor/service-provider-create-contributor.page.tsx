import React from 'react';

import { InstancePageFormComponent } from '@fc/core-partners';
import { t } from '@fc/i18n';

import { useServiceProviderCreateContributor } from '../../../hooks';

export const ServiceProviderCreateContributorPage = React.memo(() => {
  const { config, initialValues, postSubmit, preSubmit, schema, submitHandler } =
    useServiceProviderCreateContributor();

  const pageTitle = t('Partners.serviceProviderPage.usersSection.contributorCreate.title');
  return (
    <React.Fragment>
      <h1
        className="fr-col-12 fr-col-md-8"
        data-testid="service-provider-create-contributor-page-title">
        {pageTitle}
      </h1>
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

ServiceProviderCreateContributorPage.displayName = 'ServiceProviderCreateContributorPage';
