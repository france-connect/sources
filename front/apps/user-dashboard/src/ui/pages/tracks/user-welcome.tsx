import './user-welcome.scss';

import React from 'react';

import { UserInfosContext } from '@fc/oidc-client';

export const UserWelcomeComponent = React.memo(() => (
  <UserInfosContext.Consumer>
    {({ userinfos }) => (
      <section className="welcome  text-center mb40">
        <h4>Bienvenue</h4>
        <h2 className="is-blue-france">
          {userinfos && (
            <b>
              {userinfos.given_name} {userinfos.family_name}
            </b>
          )}
        </h2>
      </section>
    )}
  </UserInfosContext.Consumer>
));

UserWelcomeComponent.displayName = 'UserWelcomeComponent';
