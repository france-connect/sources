import React from 'react';

import type { BaseAttributes } from '../../interfaces';

interface DTO2SectionComponentProps {
  field: BaseAttributes;
}

export const DTO2SectionComponent = React.memo(
  ({ field: { label, name } }: DTO2SectionComponentProps) => (
    <h3 className="fr-h6" data-testid={`DTO2SectionComponent-${name}-testid`}>
      {label}
    </h3>
  ),
);

DTO2SectionComponent.displayName = 'DTO2SectionComponent';
