import type { PropsWithChildren } from 'react';
import React from 'react';

import { HeadingTag } from '@fc/common';
import { t } from '@fc/i18n';

interface StepperComponentProps extends PropsWithChildren {
  totalSteps: number;
  stepTitle: string;
  nextStepTitle?: string;
  stepNumber: number;
  heading?: HeadingTag;
}

export const StepperComponent = React.memo(
  ({
    heading: Heading = HeadingTag.H2,
    nextStepTitle = undefined,
    stepNumber,
    stepTitle,
    totalSteps,
  }: StepperComponentProps) => (
    <div className="fr-stepper">
      <Heading className="fr-stepper__title" data-testid="stepper-component-heading-title">
        {stepTitle}
        <span className="fr-stepper__state">
          {t('DSFR.stepper.location', { current: stepNumber, total: totalSteps })}
        </span>
      </Heading>
      <div
        className="fr-stepper__steps"
        data-fr-current-step={stepNumber}
        data-fr-steps={totalSteps}
      />
      {nextStepTitle && (
        <p className="fr-stepper__details">
          <span className="fr-text--bold">{t('DSFR.stepper.nextStep')}&nbsp;:</span>&nbsp;
          {nextStepTitle}
        </p>
      )}
    </div>
  ),
);

StepperComponent.displayName = 'StepperComponent';
