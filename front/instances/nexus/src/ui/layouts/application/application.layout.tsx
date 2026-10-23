import React from 'react';
import { Outlet } from 'react-router';

import { FooterComponent, HeaderComponent } from '../../components';

// @TODO temporary until the login system is in place
export const ApplicationLayout = React.memo(() => (
  <div className="sticky-body">
    <div className="sticky-content">
      <HeaderComponent />
      <Outlet />
    </div>
    <FooterComponent />
  </div>
));

ApplicationLayout.displayName = 'ApplicationLayout';
