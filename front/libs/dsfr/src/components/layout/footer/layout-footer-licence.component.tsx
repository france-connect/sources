import React from 'react';

export const LayoutFooterLicenceComponent = React.memo(() => (
  <div className="fr-footer__bottom-copy">
    <p>
      Sauf mention contraire, tous les contenus de ce site sont sous{' '}
      <a
        href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
        rel="noreferrer"
        target="_blank">
        licence etalab-2.0
      </a>
    </p>
  </div>
));

LayoutFooterLicenceComponent.displayName = 'LayoutFooterLicenceComponent';
