import type { PropsWithChildren } from 'react';
import React from 'react';

import type { HeadingTag } from '@fc/common';

interface ModalTitleComponentProps extends PropsWithChildren {
  heading: HeadingTag;
  id: string;
}

export const ModalTitleComponent = React.memo(
  ({ children, heading: Heading, id }: ModalTitleComponentProps) => (
    <Heading className="fr-modal__title" id={id}>
      {children}
    </Heading>
  ),
);

ModalTitleComponent.displayName = 'ModalTitleComponent';
