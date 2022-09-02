import { ReactNode, useContext } from 'react';

import { AppContext, AppContextInterface } from '@fc/state-management';

export type RedirectToIdpFormProps = {
  children: ReactNode;
  csrf?: string;
  id: string;
  uid?: string;
};

export const RedirectToIdpFormComponent = ({ children, csrf, id, uid }: RedirectToIdpFormProps) => {
  const {
    state: {
      config: { OidcClient },
    },
  } = useContext<AppContextInterface>(AppContext);

  const { redirectToIdp } = OidcClient.endpoints;

  return (
    <form action={redirectToIdp} aria-label="form" data-testid="csrf-form" id={id} method="post">
      {uid && <input data-testid="uid-input" name="providerUid" type="hidden" value={uid} />}
      {csrf && <input data-testid="csrf-input" name="csrfToken" type="hidden" value={csrf} />}
      {children}
    </form>
  );
};

RedirectToIdpFormComponent.defaultProps = {
  csrf: undefined,
  uid: undefined,
};

RedirectToIdpFormComponent.displayName = 'RedirectToIdpFormComponent';
