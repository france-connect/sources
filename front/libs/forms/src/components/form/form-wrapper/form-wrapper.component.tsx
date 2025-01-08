import type { PropsWithChildren } from 'react';
import type React from 'react';

import type { FormConfigInterface } from '../../../interfaces';
import { FormActionsComponent } from '../form-actions';
import { FormErrorComponent } from '../form-error';
import { FormErrorScrollComponent } from '../form-error-scroll';
import { FormHeaderComponent } from '../form-header';
import { FormMentionsComponent } from '../form-mentions';
import { FormRequiredMessageComponent } from '../form-required';

interface FormWrapperComponentProps extends PropsWithChildren {
  config: FormConfigInterface;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  pristine: boolean;
  submitError?: string | undefined;
  submitting: boolean;
  noRequired: boolean;
  scrollTopOnSubmit: boolean;
}

export const FormWrapperComponent = ({
  children,
  config,
  handleSubmit,
  noRequired,
  pristine,
  scrollTopOnSubmit,
  submitError,
  submitting,
}: FormWrapperComponentProps) => {
  const { description, id, title } = config;

  const canSubmit = !pristine && !submitting;
  const showFormHeader = !!(title || description);

  return (
    <form data-testid={`${id}--testid`} id={id} onSubmit={handleSubmit}>
      {showFormHeader && <FormHeaderComponent description={description} title={title} />}
      <div className="flex-rows">
        {!noRequired && <FormRequiredMessageComponent />}
        {children}
        <FormActionsComponent canSubmit={canSubmit} />
        {submitError && <FormErrorComponent error={submitError} />}
        <FormMentionsComponent />
        {scrollTopOnSubmit && <FormErrorScrollComponent />}
      </div>
    </form>
  );
};

FormWrapperComponent.displayName = 'FormWrapperComponent';
