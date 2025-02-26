import React from 'react';

export interface FormMentionsComponentProps {
  content: string;
}

export const FormMentionsComponent = React.memo(({ content }: FormMentionsComponentProps) => (
  <div className="fr-mt-10w">
    <p className="fr-text--xs">{content}</p>
  </div>
));

FormMentionsComponent.displayName = 'FormMentionsComponent';
