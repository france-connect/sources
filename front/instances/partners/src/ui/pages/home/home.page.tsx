import { Navigate } from 'react-router';

import { useHasServiceProviders } from '@fc/core-partners';

export const HomePage = () => {
  const hasServiceProviders = useHasServiceProviders();

  const redirectTo = hasServiceProviders ? '/fournisseurs-de-service' : '/instances';

  return <Navigate replace to={redirectTo} />;
};
