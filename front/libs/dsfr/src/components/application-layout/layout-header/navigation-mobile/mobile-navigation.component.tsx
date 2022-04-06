import './mobile-navigation.scss';

import React, { MouseEventHandler } from 'react';
import Modal from 'react-modal';

import { UserinfosInterface } from '@fc/oidc-client';

import { NavigationLink } from '../../props.interface';
import { LogoutButtonComponent } from '../logout-button';
import { NavigationLinksComponent } from '../navigation-links';
import { UserWidgetComponent } from '../user-widget';
import { MobileNavigationCloseButtonComponent } from './mobile-navigation-close-button.component';

interface MobileNavigationComponentProps {
  navigationLinks?: NavigationLink[];
  userInfos?: UserinfosInterface;
  mobileMenuIsOpen: boolean;
  onClose: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

// @TODO https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/915
// should be moved into a global file
// maybe into a specific app file ex: apps/user-dashboard/src/index.ts
// currently it is used by the mobile DSFR menu
// - what if we have more than one react-modal instance in the same app
// - what if more than one of ours libraries used it
//
// #root is a reference to a react apps wrapping html node (it can also be an user defined)
//
// @SEE https://reactcommunity.org/react-modal/accessibility/#app-element
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
  // @TODO how to mock the static function ?
  Modal.setAppElement('#root');
}

export const MobileNavigationComponent: React.FC<MobileNavigationComponentProps> = React.memo(
  ({ mobileMenuIsOpen, navigationLinks, onClose, userInfos }: MobileNavigationComponentProps) => (
    <Modal
      className="MobileNavigationComponent is-absolute fs14 lh24 py20"
      isOpen={mobileMenuIsOpen}
      overlayClassName="MobileNavigationComponent-overlay is-fixed">
      <MobileNavigationCloseButtonComponent onClose={onClose} />
      {userInfos && (
        <React.Fragment>
          <UserWidgetComponent className="mx16 is-blue-france py12" userInfos={userInfos} />
          <LogoutButtonComponent className="mx16 is-blue-france py12" />
        </React.Fragment>
      )}
      {navigationLinks && (
        <nav className="flex-rows flex-start">
          <NavigationLinksComponent
            className="MobileNavigationComponent-item mx16 is-bold py12"
            items={navigationLinks}
            onItemClick={onClose}
          />
        </nav>
      )}
    </Modal>
  ),
);

MobileNavigationComponent.defaultProps = {
  navigationLinks: undefined,
  userInfos: undefined,
};

MobileNavigationComponent.displayName = 'MobileNavigationComponent';
