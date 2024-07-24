import type { PropsWithChildren } from 'react';
import React from 'react';

import { ConfigService } from '@fc/config';

import { Options } from '../enums';
import type { OidcClientConfig } from '../interfaces';

interface RedirectToIdpFormProps extends Required<PropsWithChildren> {
  csrf?: string;
  id: string;
  uid?: string;
}

export const RedirectToIdpFormComponent = React.memo(
  ({ children, csrf, id, uid }: RedirectToIdpFormProps) => {
    const config = ConfigService.get<OidcClientConfig>(Options.CONFIG_NAME);
    const { redirectToIdp } = config.endpoints;

    return (
      <form action={redirectToIdp} aria-label="form" data-testid="csrf-form" id={id} method="post">
        {uid && <input data-testid="uid-input" name="providerUid" type="hidden" value={uid} />}
        {csrf && <input data-testid="csrf-input" name="csrfToken" type="hidden" value={csrf} />}
        {children}
      </form>
    );
  },
);

RedirectToIdpFormComponent.displayName = 'RedirectToIdpFormComponent';
