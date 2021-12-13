/* istanbul ignore file */

/**
 * @TODO #493 untested
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/493
 */
import React from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import { selectIdentityProviderInputs } from '../../redux/selectors';
import { IdentityProvider, RootState } from '../../types';

type IdentityProviderCardProps = {
  identityProvider: IdentityProvider;
};

const IdentityProviderCardContentComponent = React.memo(
  ({ identityProvider }: IdentityProviderCardProps): JSX.Element => {
    const { active, name, uid } = identityProvider;

    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
    const redirectToIdentityProviderInputs = useSelector((state: RootState) =>
      selectIdentityProviderInputs(state, uid),
    );

    return (
      <div className={classnames("flex-center rounded card-wrapper bg-blue-france-100", {"px24 pt24": gtTablet, "p24": !gtTablet})}>
        <div className="mb8 form-title">Mon compte</div>
        <RedirectToIdpFormComponent id={`fca-history-idp-${uid}`}>
          {redirectToIdentityProviderInputs.map(([inputKey, inputValue]) => (
            <input
              key={inputKey}
              defaultValue={inputValue}
              name={inputKey}
              type="hidden"
            />
          ))}
          <button className="form-button is-bold fr-text-lead" disabled={!active} type="submit">
            {name}
          </button>
        </RedirectToIdpFormComponent>
      </div>
    );
  },
);

IdentityProviderCardContentComponent.displayName =
  'IdentityProviderCardContentComponent';

export default IdentityProviderCardContentComponent;
