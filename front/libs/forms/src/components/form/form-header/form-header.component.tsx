import React from 'react';

import { HeadingTag } from '@fc/common';

interface FormHeaderComponentProps {
  title?: string;
  description?: string;
  titleHeading?: HeadingTag;
}

export const FormHeaderComponent = React.memo(
  ({ description, title, titleHeading: Heading = HeadingTag.H1 }: FormHeaderComponentProps) => (
    <React.Fragment>
      {title && (
        <Heading className="fc-text-align--left-md-center fr-text--title-blue-france">
          {title}
        </Heading>
      )}
      {description && <p className="fc-text-align--left-md-center fr-text--lg">{description}</p>}
    </React.Fragment>
  ),
);

FormHeaderComponent.displayName = 'FormHeaderComponent';
