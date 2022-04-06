import classnames from 'classnames';
import React from 'react';
import { RiUser3Fill as UserIcon } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';

import { UserinfosInterface } from '@fc/oidc-client';

interface UserWidgetComponentProps {
  className?: string;
  userInfos: UserinfosInterface;
}

export const UserWidgetComponent: React.FC<UserWidgetComponentProps> = React.memo(
  ({ className, userInfos }: UserWidgetComponentProps) => {
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
    const {
      // oidc spec defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name,
      // oidc spec defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name,
    } = userInfos;

    return (
      <div
        className={classnames(
          'UserWidgetComponent flex-columns items-center is-blue-france no-flex-grow no-white-space',
          { 'flex-end': gtTablet },
          className,
        )}>
        <UserIcon className="mr8" />
        <span>
          {given_name} {family_name}
        </span>
      </div>
    );
  },
);

UserWidgetComponent.defaultProps = {
  className: '',
};

UserWidgetComponent.displayName = 'UserWidgetComponent';
