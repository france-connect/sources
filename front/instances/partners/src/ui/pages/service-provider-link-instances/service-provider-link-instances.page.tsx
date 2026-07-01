import React from 'react';
import { Field, Form } from 'react-final-form';

import { isoToDate, truncateMiddle } from '@fc/common';
import {
  ButtonGroupComponent,
  ButtonTypes,
  CheckboxComponent,
  Priorities,
  SimpleButton,
  TableComponent,
} from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useLinkableInstancesToServiceProvider } from '../../../hooks/service-provider-link-instances';
import classes from './service-provider-link-instances.page.module.scss';

export const ServiceProviderLinkInstancesPage = React.memo(() => {
  const {
    handleCancel,
    handleSubmit,
    initialValues,
    linkableInstances,
    serviceProviderName,
    validateHandler,
  } = useLinkableInstancesToServiceProvider();

  const sources = linkableInstances.map(({ createdAt, currentVersion, id }) => {
    const instanceName = currentVersion.data.name ?? '';
    const signupId = currentVersion.data.signupId?.trim() || '-';

    return {
      clientId: truncateMiddle(currentVersion.data.client_id ?? ''),
      createdAt: isoToDate(createdAt),
      name: (
        <div className="fr-text--bold">
          <Field name={`instances.${id}`} type="checkbox">
            {({ input }) => <CheckboxComponent input={input} label={instanceName} />}
          </Field>
        </div>
      ),
      signupId,
    };
  });

  return (
    <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
      <h1 className="fr-display--sm">{t('Partners.linkInstances.title')}</h1>
      {serviceProviderName && <p className="fr-display--xs fr-mb-3w">{serviceProviderName}</p>}
      <p className="fr-text--lead fr-mb-3w">{t('Partners.linkInstances.description')}</p>
      <Form
        initialValues={initialValues}
        render={({ form, handleSubmit: submitHandler, hasValidationErrors, values }) => {
          const allSelected =
            linkableInstances.length > 0 &&
            linkableInstances.every(({ id }) => values?.instances?.[id]);

          return (
            <form onSubmit={submitHandler}>
              <div className={`fr-mb-3w fr-p-2w ${classes.selectAll}`}>
                <div className="fr-checkbox-group">
                  <input
                    checked={allSelected}
                    id="link-instances-select-all"
                    type="checkbox"
                    onChange={(event) => {
                      const newInstances = { ...values?.instances };
                      linkableInstances.forEach(({ id }) => {
                        newInstances[id] = event.target.checked;
                      });
                      form.change('instances', newInstances);
                    }}
                  />
                  <label className="fr-label" htmlFor="link-instances-select-all">
                    {t('Partners.linkInstances.selectAll')}
                  </label>
                </div>
              </div>
              <TableComponent
                multiline
                columns={[
                  {
                    key: 'name',
                    label: t('Partners.linkInstances.columns.instanceName'),
                  },
                  {
                    key: 'clientId',
                    label: t('Partners.linkInstances.columns.clientId'),
                  },
                  {
                    key: 'signupId',
                    label: t('Partners.linkInstances.columns.datapassRequestId'),
                  },
                  {
                    key: 'createdAt',
                    label: t('Partners.linkInstances.columns.createdAt'),
                  },
                ]}
                id="link-instances-table"
                sources={sources}
              />
              <div className="fr-grid-row fr-grid-row--right fr-mt-5w">
                <ButtonGroupComponent>
                  <SimpleButton disabled={hasValidationErrors} type={ButtonTypes.SUBMIT}>
                    {t('Partners.linkInstances.submit')}
                  </SimpleButton>
                  <SimpleButton
                    priority={Priorities.SECONDARY}
                    type={ButtonTypes.BUTTON}
                    onClick={handleCancel}>
                    {t('Partners.linkInstances.cancel')}
                  </SimpleButton>
                </ButtonGroupComponent>
              </div>
            </form>
          );
        }}
        validate={validateHandler}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

ServiceProviderLinkInstancesPage.displayName = 'ServiceProviderLinkInstancesPage';
