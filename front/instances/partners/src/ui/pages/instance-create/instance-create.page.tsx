import React from 'react';

import { DTO2FormComponent } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { useInstanceCreate } from '../../../hooks';

export const InstanceCreatePage = React.memo(() => {
  const { initialValues, schema, submitHandler } = useInstanceCreate();

  return (
    <React.Fragment>
      <h1 className="fr-col-12 fr-col-md-8">{t('Partners.createpage.title')}</h1>
      <div className="fr-col-12 fr-col-md-8 fr-py-6w fc-grey-border--full">
        <div className="fr-col-offset-1 fr-col-10">
          <DTO2FormComponent
            config={{ id: 'DTO2Form-instance-create' }}
            initialValues={initialValues}
            schema={schema}
            onSubmit={submitHandler}
          />
        </div>
      </div>
    </React.Fragment>
  );
});

InstanceCreatePage.displayName = 'InstanceCreatePage';
