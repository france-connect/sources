import React from 'react';

export const NotFoundComponent = React.memo(() => (
  <div className="container">
    <h1 className="text-center">404 - Not Found</h1>
  </div>
));

NotFoundComponent.displayName = 'NotFoundComponent';
