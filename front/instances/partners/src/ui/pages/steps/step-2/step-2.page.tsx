/* istanbul ignore file */

// declarative file
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonGroupComponent, LinkComponent, SimpleButton, StepperComponent } from '@fc/dsfr';

export const Step2Page = React.memo(() => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <StepperComponent
        currentStep={2}
        currentStepTitle="Step title 2"
        nextStepTitle="Step title 3"
        totalSteps={5}
      />
      <div>Contenu Page 2</div>
      <ButtonGroupComponent>
        <SimpleButton
          label="précédent"
          onClick={() => {
            navigate('../step-1');
          }}
        />
        <LinkComponent href="../step-3" label="suivant" />
      </ButtonGroupComponent>
    </React.Fragment>
  );
});

Step2Page.displayName = 'Step2Page';
