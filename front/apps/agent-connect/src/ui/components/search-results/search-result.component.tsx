import React from 'react';

import { useAddToUserHistory } from '@fc/agent-connect-history';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

type SearchResultComponentProps = {
  name: string;
  uid: string;
  csrfToken: string;
};

export const SearchResultComponent = React.memo(
  ({ csrfToken, name, uid }: SearchResultComponentProps) => {
    const addToUserHistory = useAddToUserHistory(uid);

    return (
      <RedirectToIdpFormComponent csrf={csrfToken} id={`fca-search-idp-${uid}`} uid={uid}>
        <button
          className="is-underline fr-text--lg fr-mb-0 text-left"
          id={`idp-${uid}-button`}
          type="submit"
          onClick={addToUserHistory}>
          {name}
        </button>
      </RedirectToIdpFormComponent>
    );
  },
);

SearchResultComponent.displayName = 'SearchResultComponent';
