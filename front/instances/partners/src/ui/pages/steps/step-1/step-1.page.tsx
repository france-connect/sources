/* istanbul ignore file */

// declarative file
import React from 'react';
import { Link } from 'react-router-dom';

import { ButtonGroupComponent, StepperComponent } from '@fc/dsfr';

export const Step1Page = React.memo(() => (
  <React.Fragment>
    <StepperComponent
      currentStep={1}
      currentStepTitle="Step title 1"
      nextStepTitle="Step title 2"
      totalSteps={5}
    />
    <div>Contenu Page 1</div>
    <ButtonGroupComponent>
      <Link to="./step-2">suivant</Link>
    </ButtonGroupComponent>
  </React.Fragment>
));

Step1Page.displayName = 'Step1Page';
