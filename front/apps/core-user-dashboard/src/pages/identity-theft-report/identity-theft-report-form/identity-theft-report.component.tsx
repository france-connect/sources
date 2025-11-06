import React from 'react';

import { useSafeContext } from '@fc/common';
import { StepperContext } from '@fc/dsfr';
import { Dto2FormComponent, removeEmptyValues } from '@fc/dto2form';
import { useDto2FormService } from '@fc/dto2form-service';

interface IdentityTheftReportFormComponentProps {
  id: string;
}

export const IdentityTheftReportFormComponent = React.memo(
  ({ id }: IdentityTheftReportFormComponentProps) => {
    const { gotoNextStep } = useSafeContext(StepperContext);

    const { form, initialValues, schema, submitHandler } = useDto2FormService(id);

    return (
      <div className="fr-border-default--grey fr-mt-3w fr-p-3w">
        <Dto2FormComponent
          config={form}
          initialValues={initialValues}
          schema={schema}
          onPostSubmit={gotoNextStep}
          onPreSubmit={removeEmptyValues}
          onSubmit={submitHandler}
        />
      </div>
    );
  },
);

IdentityTheftReportFormComponent.displayName = 'IdentityTheftReportFormComponent';
