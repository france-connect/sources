/* istanbul ignore file */

// declarative file
import React from 'react';

import { ButtonGroupComponent, LinkComponent, StepperComponent } from '@fc/dsfr';

export const Step4Page = React.memo(() => (
  <React.Fragment>
    <StepperComponent
      currentStep={4}
      currentStepTitle="Step title 4"
      nextStepTitle="Step title 5"
      totalSteps={5}
    />
    <div>Contenu Page 4</div>
    <ButtonGroupComponent>
      <LinkComponent href="../step-3" label="précédent" />
      <LinkComponent href="../step-5" label="suivant" />
    </ButtonGroupComponent>
  </React.Fragment>
));

Step4Page.displayName = 'Step4Page';
