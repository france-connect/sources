import type { PropsWithChildren } from 'react';
import React from 'react';

export const ModalFooterComponent = React.memo(({ children }: PropsWithChildren) => (
  <div className="fr-modal__footer">{children}</div>
));

ModalFooterComponent.displayName = 'ModalFooterComponent';
