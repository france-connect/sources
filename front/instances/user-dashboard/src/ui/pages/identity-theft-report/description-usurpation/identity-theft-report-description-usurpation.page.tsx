import React, { use } from 'react';

import { EventTypes } from '@fc/common';
import { ConfigService } from '@fc/config';
import { AlertComponent, StepperContext } from '@fc/dsfr';
import type { Dto2FormConfigInterface } from '@fc/dto2form';
import { DTO2FormComponent, removeEmptyValues, useDto2Form } from '@fc/dto2form';
import { t } from '@fc/i18n';

export const IdentityTheftReportDescriptionUsurpationPage = React.memo(() => {
  const { gotoNextStep } = use(StepperContext);

  // @TODO replace by import { Options.CONFIG_NAME } from '@fc/dto2form';
  const { IdentityTheftDescription } = ConfigService.get<Dto2FormConfigInterface>('Dto2Form');

  const { initialValues, schema, submitHandler } = useDto2Form(IdentityTheftDescription);

  return (
    <React.Fragment>
      <h2>Description de l’usurpation</h2>
      <AlertComponent
        title="Munissez vous de l’alerte de connexion que vous avez reçue par email."
        type={EventTypes.INFO}>
        <p>Vous trouverez dans l’email les informations nécessaires à nous transmettre.</p>
      </AlertComponent>
      <div className="fr-border-default--grey fr-mt-3w fr-p-3w">
        <DTO2FormComponent
          config={IdentityTheftDescription}
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

IdentityTheftReportDescriptionUsurpationPage.displayName =
  'IdentityTheftReportDescriptionUsurpationPage';
