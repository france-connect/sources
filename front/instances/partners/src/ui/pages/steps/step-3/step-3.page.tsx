/* istanbul ignore file */

// declarative file
import React from 'react';

import { ButtonGroupComponent, LinkComponent, StepperComponent } from '@fc/dsfr';

export const Step3Page = React.memo(() => (
  <React.Fragment>
    <StepperComponent
      currentStep={3}
      currentStepTitle="Step title 3"
      nextStepTitle="Step title 4"
      totalSteps={5}
    />
    <div>Contenu Page 3</div>
    <ButtonGroupComponent>
      <LinkComponent href="../step-2" label="précédent" />
      <LinkComponent href="../step-4" label="suivant" />
    </ButtonGroupComponent>
  </React.Fragment>
));

Step3Page.displayName = 'Step3Page';
