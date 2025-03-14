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
  scrollTopOnSubmit,
  submitError,
  submitting,
}: FormWrapperComponentProps) => {
  const { description, id, mentions, title, titleHeading } = config;

  const canSubmit = !submitting;
  const showFormHeader = !!(title || description);

  return (
    <form className="dto2form" data-testid={`${id}--testid`} id={id} onSubmit={handleSubmit}>
      {showFormHeader && (
        <FormHeaderComponent description={description} title={title} titleHeading={titleHeading} />
      )}
      <div className="flex-rows">
        {submitError && <FormErrorComponent error={submitError} />}
        {!noRequired && <FormRequiredMessageComponent />}
        {children}
        <FormActionsComponent canSubmit={canSubmit} />
        {mentions && <FormMentionsComponent content={mentions} />}
        <FormErrorScrollComponent
          active={scrollTopOnSubmit}
          elementClassName=".fr-message--error"
        />
      </div>
    </form>
  );
};

FormWrapperComponent.displayName = 'FormWrapperComponent';
