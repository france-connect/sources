import './user-preferences.scss';

import classnames from 'classnames';
import React from 'react';

import { Service } from '../interfaces';
import { ServiceComponent } from './service.component';

interface ServicesListComponentProps {
  identityProviders: Service[] | undefined;
}

export const ServicesListComponent: React.FC<ServicesListComponentProps> = React.memo(
  ({ identityProviders }: ServicesListComponentProps) => {
    const servicesLength = (identityProviders && identityProviders.length) || 0;
    return (
      <ul className="ServicesListComponent mt24 unstyled-list">
        {identityProviders &&
          identityProviders.map((idp, index) => {
            const first = index === 0;
            const last = index === servicesLength - 1;
            return (
              <ServiceComponent
                key={idp.uid}
                className={classnames({
                  mb16: !last,
                  pt16: !first,
                  // Classe CSS
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  'with-border': !first,
                })}
                service={idp}
              />
            );
          })}
      </ul>
    );
  },
);

ServicesListComponent.displayName = 'ServicesListComponent';
