import React from 'react';

import type { BadgeInterface } from '../../interfaces';
import { BadgeComponent } from '../badge';

interface BadgesGroupComponentProps {
  item: BadgeInterface[];
}

export const BadgesGroupComponent = React.memo(({ item }: BadgesGroupComponentProps) => (
  <div className="fr-badge-group">
    {item.map((badge, index) => {
      const uniqkey = `badge-group::badge::${index}`;
      return <BadgeComponent key={uniqkey} colorName={badge.colorName} label={badge.label} />;
    })}
  </div>
));

BadgesGroupComponent.displayName = 'BadgesGroupComponent';
