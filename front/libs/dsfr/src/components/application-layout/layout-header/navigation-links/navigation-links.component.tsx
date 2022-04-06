import classnames from 'classnames';
import React, { MouseEventHandler } from 'react';
import { NavLink } from 'react-router-dom';

import { NavigationLink } from '../../props.interface';

interface NavigationLinksComponentProps {
  items: NavigationLink[];
  className?: string;
  onItemClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export const NavigationLinksComponent: React.FC<NavigationLinksComponentProps> = React.memo(
  ({ className, items, onItemClick }: NavigationLinksComponentProps) => (
    <React.Fragment>
      {items.map((link) => (
        <NavLink
          key={link.href}
          activeClassName="current is-blue-france"
          aria-current="page"
          className={classnames(
            'NavigationLinkComponent is-g700 no-underline is-relative is-inline-block fs14 lh24',
            className,
          )}
          title={link.a11y}
          to={link.href}
          onClick={onItemClick}>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </React.Fragment>
  ),
);

NavigationLinksComponent.defaultProps = {
  className: '',
  onItemClick: undefined,
};

NavigationLinksComponent.displayName = 'NavigationLinksComponent';
