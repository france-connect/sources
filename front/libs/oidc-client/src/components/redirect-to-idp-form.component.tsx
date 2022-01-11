import { ReactNode, useContext } from 'react';

import { AppContext, AppContextInterface } from '@fc/state-management';

type RedirectToIdpFormProps = {
  id: string;
  csrf?: string;
  children: ReactNode;
};

export const RedirectToIdpFormComponent = ({ children, csrf, id }: RedirectToIdpFormProps) => {
  const {
    state: {
      config: { OidcClient },
    },
  } = useContext<AppContextInterface>(AppContext);

  const { redirectToIdp } = OidcClient.endpoints;

  return (
    <form action={redirectToIdp} aria-label="form" data-testid="csrf-form" id={id} method="post">
      {csrf && <input data-testid="csrf-input" name="csrfToken" type="hidden" value={csrf} />}
      {children}
    </form>
  );
};

RedirectToIdpFormComponent.defaultProps = {
  csrf: null,
};

RedirectToIdpFormComponent.displayName = 'RedirectToIdpFormComponent';
