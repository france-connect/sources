import './user-welcome.scss';

import { useUserinfos } from '@fc/oidc-client';

export const UserWelcomeComponent = () => {
  const user = useUserinfos();

  return (
    <section className="welcome  text-center mb40">
      <h4>Bienvenue</h4>
      <h2 className="is-blue-france">
        {user && (
          <b>
            {user.userinfos.given_name} {user.userinfos.family_name}
          </b>
        )}
      </h2>
    </section>
  );
};

UserWelcomeComponent.displayName = 'UserWelcomeComponent';
