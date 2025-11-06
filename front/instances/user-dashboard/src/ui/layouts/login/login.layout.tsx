import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { useDocumentTitle } from 'usehooks-ts';

import type { AccountContextState } from '@fc/account';
import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';
import { SessionExpiredAlertComponent } from '@fc/core-user-dashboard';
import { Sizes } from '@fc/dsfr';

interface LoginLayoutProps extends Required<PropsWithChildren> {
  size: Sizes;
  documentTitle: string;
}

export const LoginLayout = React.memo(({ children, documentTitle, size }: LoginLayoutProps) => {
  const { expired } = useSafeContext<AccountContextState>(AccountContext);

  useDocumentTitle(documentTitle);

  return (
    <div className="fr-container fr-mt-5w fr-mt-md-8w">
      <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
        <div
          className={classnames('text-left text-center--md fr-col-12', {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-col-lg-10': size === Sizes.MEDIUM,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-col-lg-8': size === Sizes.SMALL,
          })}>
          {expired && <SessionExpiredAlertComponent />}
          {children}
        </div>
      </div>
    </div>
  );
});

LoginLayout.displayName = 'LoginLayout';
