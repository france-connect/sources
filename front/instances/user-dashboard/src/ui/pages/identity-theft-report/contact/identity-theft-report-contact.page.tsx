import React, { use } from 'react';

import { ConfigService } from '@fc/config';
import { StepperContext } from '@fc/dsfr';
import type { Dto2FormConfigInterface } from '@fc/dto2form';
import { DTO2FormComponent, removeEmptyValues, useDto2Form } from '@fc/dto2form';
import { t } from '@fc/i18n';

export const IdentityTheftReportContactPage = React.memo(() => {
  const { gotoNextStep } = use(StepperContext);

  // @TODO replace by import { Options.CONFIG_NAME } from '@fc/dto2form';
  const { IdentityTheftContact } = ConfigService.get<Dto2FormConfigInterface>('Dto2Form');

  const { initialValues, schema, submitHandler } = useDto2Form(IdentityTheftContact);

  return (
    <React.Fragment>
      <h2>Moyens de contact</h2>
      <div className="fr-border-default--grey fr-mt-3w fr-p-3w">
        <DTO2FormComponent
          config={IdentityTheftContact}
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

IdentityTheftReportContactPage.displayName = 'IdentityTheftReportContactPage';
