import React from 'react';

import type { BaseAttributes } from '../../interfaces';

interface Dto2SectionComponentProps {
  field: BaseAttributes;
}

export const Dto2SectionComponent = React.memo(
  ({ field: { label, name } }: Dto2SectionComponentProps) => (
    <h3 className="fr-h6" data-testid={`Dto2SectionComponent-${name}-testid`}>
      {label}
    </h3>
  ),
);

Dto2SectionComponent.displayName = 'Dto2SectionComponent';
