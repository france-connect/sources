/* istanbul ignore file */

// declarative file
import React from 'react';

import { ButtonGroupComponent, LinkComponent, StepperComponent } from '@fc/dsfr';

export const Step5Page = React.memo(() => (
  <React.Fragment>
    <StepperComponent currentStep={5} currentStepTitle="Step title 5" totalSteps={5} />
    <div>Contenu Page 5</div>
    <ButtonGroupComponent>
      <LinkComponent href="../step-4" label="précédent" />
    </ButtonGroupComponent>
  </React.Fragment>
));

Step5Page.displayName = 'Step5Page';
