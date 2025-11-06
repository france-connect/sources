import React from 'react';

import { Strings } from '@fc/common';

import type { MediaInterface } from '../../../interfaces';

export const CardMediaComponent = React.memo(
  ({ alt = Strings.EMPTY_STRING, src }: MediaInterface) => (
    <div className="fr-card__img">
      <img alt={alt} className="fr-responsive-img" src={src} />
    </div>
  ),
);

CardMediaComponent.displayName = 'CardMediaComponent';
