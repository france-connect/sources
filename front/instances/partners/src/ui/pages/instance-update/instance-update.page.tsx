import React from 'react';

import { DTO2FormComponent } from '@fc/dto2form';

import { useInstanceUpdate } from '../../../hooks';

export const InstanceUpdatePage = React.memo(() => {
  const { initialValues, schema, submitHandler, title } = useInstanceUpdate();

  return (
    <div className="fr-col-12 fr-col-md-8 fc-grey-border--full">
      <div className="fr-col-offset-1 fr-col-10">
        <h1>{title}</h1>
        <DTO2FormComponent
          config={{ id: 'DTO2Form-instance-update' }}
          initialValues={initialValues}
          schema={schema}
          onSubmit={submitHandler}
        />
      </div>
    </div>
  );
});

InstanceUpdatePage.displayName = 'InstanceUpdatePage';
