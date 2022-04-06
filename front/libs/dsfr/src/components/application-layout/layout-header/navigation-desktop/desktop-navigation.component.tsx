import './desktop-navigation.scss';

import React from 'react';

import { NavigationLink } from '../../props.interface';
import { NavigationLinksComponent } from '../navigation-links';

interface DesktopNavigationComponentProps {
  navigationLinks: NavigationLink[];
}

export const DesktopNavigationComponent: React.FC<DesktopNavigationComponentProps> = React.memo(
  ({ navigationLinks }: DesktopNavigationComponentProps): JSX.Element => (
    <div className="DesktopNavigationComponent-container">
      <div className="content-wrapper-lg px16">
        <nav className="DesktopNavigationComponent-nav">
          <NavigationLinksComponent
            className="DesktopNavigationComponent-item p16"
            items={navigationLinks}
          />
        </nav>
      </div>
    </div>
  ),
);

DesktopNavigationComponent.displayName = 'DesktopNavigationComponent';
