import React, { use } from 'react';
import { useToggle } from 'usehooks-ts';

import { ConfigService } from '@fc/config';
import { AccordionComponent, StepperContext } from '@fc/dsfr';
import type { Dto2FormConfigInterface } from '@fc/dto2form';
import { DTO2FormComponent, removeEmptyValues, useDto2Form } from '@fc/dto2form';
import { t } from '@fc/i18n';

export const IdentityTheftReportAuthenticationEventIdPage = React.memo(() => {
  const { gotoNextStep } = use(StepperContext);
  const [expanded, toggleExpanded] = useToggle(false);

  // @TODO replace by import { Options.CONFIG_NAME } from '@fc/dto2form';
  const { IdentityTheftConnection } = ConfigService.get<Dto2FormConfigInterface>('Dto2Form');

  const { initialValues, schema, submitHandler } = useDto2Form(IdentityTheftConnection);

  return (
    <React.Fragment>
      <h2>Identification de la connexion</h2>
      <div className="fr-border-default--grey fr-mt-3w fr-p-3w">
        <DTO2FormComponent
          config={IdentityTheftConnection}
          initialValues={initialValues}
          schema={schema}
          submitLabel={t('DSFR.stepper.nextStepButton')}
          onPostSubmit={gotoNextStep}
          onPreSubmit={removeEmptyValues}
          onSubmit={submitHandler}
        />
      </div>
      <AccordionComponent
        className="fr-mt-8w"
        opened={expanded}
        title="Où se trouve le code d’identification ?"
        onClick={toggleExpanded}>
        <p className="fr-background-alt--grey fr-px-2w fr-py-3w fr-mb-0">
          Vous trouverez le code dans l’alerte de connexion que vous avez reçue par mail.
          <img
            alt="Où trouver le code d'identification ?"
            className="fr-responsive-img fr-mt-2w"
            src="/images/fraud/mail-notification-connexion.png"
          />
        </p>
      </AccordionComponent>
    </React.Fragment>
  );
});

IdentityTheftReportAuthenticationEventIdPage.displayName =
  'IdentityTheftReportAuthenticationEventIdPage';
