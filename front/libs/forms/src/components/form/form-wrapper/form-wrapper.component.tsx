import type { PropsWithChildren } from 'react';
import type React from 'react';

import type { FormConfigInterface } from '../../../interfaces';
import { FormActionsComponent } from '../form-actions';
import { FormErrorComponent } from '../form-error';
import { FormErrorScrollComponent } from '../form-error-scroll';
import { FormHeaderComponent } from '../form-header';
import { FormMentionsComponent } from '../form-mentions';
import { FormRequiredMessageComponent } from '../form-required';

interface FormWrapperComponentProps extends Required<PropsWithChildren> {
  config: FormConfigInterface;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitError?: string | undefined;
  submitting: boolean;
}

export const FormWrapperComponent = ({
  children,
  config,
  handleSubmit,
  submitError,
  submitting,
}: FormWrapperComponentProps) => {
  const { actions, description, id, mentions, noRequired, scrollTopOnSubmit, title, titleHeading } =
    config;

  const canSubmit = !submitting;
  const showFormHeader = !!(title || description);
  const scrollTopOnFailed = scrollTopOnSubmit ?? true;

  return (
    <form className="dto2form" data-testid={`${id}--testid`} id={id} onSubmit={handleSubmit}>
      {showFormHeader && (
        <FormHeaderComponent description={description} title={title} titleHeading={titleHeading} />
      )}
      <div className="flex-rows">
        {submitError && <FormErrorComponent error={submitError} />}
        {!noRequired && <FormRequiredMessageComponent />}
        {children}
        <FormActionsComponent actions={actions} canSubmit={canSubmit} />
        {mentions && <FormMentionsComponent content={mentions} />}
        <FormErrorScrollComponent
          active={scrollTopOnFailed}
          elementClassName=".fr-message--error"
        />
      </div>
    </form>
  );
};

FormWrapperComponent.displayName = 'FormWrapperComponent';
