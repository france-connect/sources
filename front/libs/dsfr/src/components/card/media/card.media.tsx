import React from 'react';

import type { MediaInterface } from '../../../interfaces';

export const CardMediaComponent = React.memo(({ alt = '', src }: MediaInterface) => (
  <div className="fr-card__img">
    <img alt={alt} className="fr-responsive-img" src={src} />
  </div>
));

CardMediaComponent.displayName = 'CardMediaComponent';
