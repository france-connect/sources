import React from 'react';

import type { BaseAttributes } from '@fc/dto2form';
import { Dto2FormComponent } from '@fc/dto2form';
import type { FormConfigInterface, FormInterface } from '@fc/forms';
import type { HttpClientDataInterface } from '@fc/http-client';

interface InstancePageFormComponentProps<T extends HttpClientDataInterface> {
  config: FormConfigInterface;
  initialValues: T;
  postSubmit: () => Promise<undefined>;
  preSubmit: (values: T) => Promise<T>;
  schema: BaseAttributes[];
  submitHandler: FormInterface<T>['onSubmit'];
}

export const InstancePageFormComponent = React.memo(
  <T extends HttpClientDataInterface>({
    config,
    initialValues,
    postSubmit,
    preSubmit,
    schema,
    submitHandler,
  }: InstancePageFormComponentProps<T>) => (
    <div className="fr-col-12 fr-col-md-8 fr-py-6w fc-grey-border--full">
      <div className="fr-col-offset-1 fr-col-10">
        <Dto2FormComponent
          config={config}
          initialValues={initialValues}
          schema={schema}
          onPostSubmit={postSubmit}
          onPreSubmit={preSubmit}
          onSubmit={submitHandler}
        />
      </div>
    </div>
  ),
);

InstancePageFormComponent.displayName = 'InstancePageFormComponent';
