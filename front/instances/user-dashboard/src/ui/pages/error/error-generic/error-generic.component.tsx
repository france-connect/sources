import React from 'react';

export const ErrorGenericComponent = React.memo(() => (
  <React.Fragment>
    <h2>Une erreur inconnue est survenue</h2>
  </React.Fragment>
));

ErrorGenericComponent.displayName = 'ErrorGenericComponent';
