import React from 'react';

export const Error409Component = React.memo(() => (
  <React.Fragment>
    <h2>Une erreur est survenue</h2>
    <h6>Erreur 409</h6>
    <p>Vous n&rsquo;avez pas les droits d&rsquo;effectuer cette action</p>
  </React.Fragment>
));

Error409Component.displayName = 'Error409Component';
