import { ReactNode, useContext } from 'react';
import { AppContext, AppContextInterface } from '@fc/state-management';

export const RedirectToIdpFormComponent = ({
  id,
  csrf,
  children,
}: {
  id: string;
  csrf?: string;
  children: ReactNode;
}) => {
  const {
    state: {
      config: { OidcClient },
    },
  } = useContext<AppContextInterface>(AppContext);

  const { redirectToIdp } = OidcClient.endpoints;

  return (
    <form action={redirectToIdp} aria-label="form" method="post" id={id}>
      {csrf && <input name="csrfToken" type="hidden" value={csrf} />}
      {children}
    </form>
  );
};

RedirectToIdpFormComponent.displayName = 'RedirectToIdpFormComponent';
