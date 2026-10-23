import React from 'react';
import { useLoaderData } from 'react-router';

import type { StatusLoaderResponseInterface } from '../../../interfaces';

export const HomePage = React.memo(() => {
  const { data } = useLoaderData<StatusLoaderResponseInterface>();

  return (
    <main className="fr-container fr-py-8v">
      <h1 data-testid="home-page-title">{data.status}</h1>
    </main>
  );
});

HomePage.displayName = 'HomePage';
