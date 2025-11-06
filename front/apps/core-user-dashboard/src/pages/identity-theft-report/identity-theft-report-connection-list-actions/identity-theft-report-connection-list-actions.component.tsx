import React from 'react';

import { useSafeContext } from '@fc/common';
import { Priorities, SimpleButton, StepperContext } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const IdentityTheftReportConnectionListActionsComponent = React.memo(() => {
  const { gotoNextStep, gotoPreviousStep } = useSafeContext(StepperContext);

  return (
    <div className="fr-mt-5w text-right">
      <SimpleButton
        className="fr-mr-2w"
        dataTestId="enter-new-code-button"
        priority={Priorities.SECONDARY}
        onClick={gotoPreviousStep}>
        {t('IdentityTheftReport.tracks.enterNewCode')}
      </SimpleButton>
      <SimpleButton dataTestId="validate-connections-button" onClick={gotoNextStep}>
        {t('DSFR.stepper.nextStepButton')}
      </SimpleButton>
    </div>
  );
});

IdentityTheftReportConnectionListActionsComponent.displayName =
  'IdentityTheftReportConnectionListActionsComponent';
