import React from 'react';

interface FormHeaderComponentProps {
  title?: string;
  description?: string;
}

export const FormHeaderComponent = React.memo(
  ({ description, title }: FormHeaderComponentProps) => (
    <React.Fragment>
      {title && (
        <h1 className="fc-text-align--left-md-center fr-text--title-blue-france">{title}</h1>
      )}
      {description && <p className="fc-text-align--left-md-center fr-text--lg">{description}</p>}
    </React.Fragment>
  ),
);

FormHeaderComponent.displayName = 'FormHeaderComponent';
