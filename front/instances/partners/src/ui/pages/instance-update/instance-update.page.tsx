import React from 'react';

import { HeadingTag } from '@fc/common';
import { DTO2FormComponent } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { useInstanceUpdate } from '../../../hooks';

export const InstanceUpdatePage = React.memo(() => {
  const { initialValues, schema, submitHandler, title } = useInstanceUpdate();

  return (
    <React.Fragment>
      <h1 className="fr-col-12 fr-col-md-8">{t('Partners.updatepage.title')}</h1>
      <div className="fr-col-12 fr-col-md-8 fr-py-6w fc-grey-border--full">
        <div className="fr-col-offset-1 fr-col-10">
          <DTO2FormComponent
            config={{ id: 'DTO2Form-instance-update', title, titleHeading: HeadingTag.H2 }}
            initialValues={initialValues}
            schema={schema}
            onSubmit={submitHandler}
          />
        </div>
      </div>
    </React.Fragment>
  );
});

InstanceUpdatePage.displayName = 'InstanceUpdatePage';
