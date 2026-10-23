import React from 'react';

export const DefaultArtworkComponent = React.memo(() => (
  <svg
    aria-hidden="true"
    className="fr-responsive-img fr-artwork"
    height="200"
    viewBox="0 0 160 200"
    width="160"
    xmlns="http://www.w3.org/2000/svg">
    <use className="fr-artwork-motif" href="/dsfr/artwork/background/ovoid.svg#artwork-motif" />
    <use
      className="fr-artwork-background"
      href="/dsfr/artwork/background/ovoid.svg#artwork-background"
    />
    <g transform="translate(40, 60)">
      <use
        className="fr-artwork-decorative"
        href="/dsfr/artwork/pictograms/system/technical-error.svg#artwork-decorative"
      />
      <use
        className="fr-artwork-minor"
        href="/dsfr/artwork/pictograms/system/technical-error.svg#artwork-minor"
      />
      <use
        className="fr-artwork-major"
        href="/dsfr/artwork/pictograms/system/technical-error.svg#artwork-major"
      />
    </g>
  </svg>
));

DefaultArtworkComponent.displayName = 'DefaultArtworkComponent';
