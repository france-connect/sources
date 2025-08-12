import React, { use } from 'react';

import { ConfigService } from '@fc/config';
import { StepperContext } from '@fc/dsfr';
import type { Dto2FormConfigInterface } from '@fc/dto2form';
import { DTO2FormComponent, removeEmptyValues, useDto2Form } from '@fc/dto2form';
import { t } from '@fc/i18n';

export const IdentityTheftReportPivotIdentityPage = React.memo(() => {
  const { gotoNextStep } = use(StepperContext);

  // @TODO replace by import { Options.CONFIG_NAME } from '@fc/dto2form';
  const { IdentityTheftIdentity } = ConfigService.get<Dto2FormConfigInterface>('Dto2Form');

  const { initialValues, schema, submitHandler } = useDto2Form(IdentityTheftIdentity);

  return (
    <React.Fragment>
      <h2>Identité de la personne usurpée</h2>
      <div className="fr-border-default--grey fr-mt-3w fr-p-3w">
        <DTO2FormComponent
          config={IdentityTheftIdentity}
          initialValues={initialValues}
          schema={schema}
          submitLabel={t('DSFR.stepper.nextStepButton')}
          onPostSubmit={gotoNextStep}
          onPreSubmit={removeEmptyValues}
          onSubmit={submitHandler}
        />
      </div>
    </React.Fragment>
  );
});

IdentityTheftReportPivotIdentityPage.displayName = 'IdentityTheftReportPivotIdentityPage';
