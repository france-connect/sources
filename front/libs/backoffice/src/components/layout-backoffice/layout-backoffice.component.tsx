/* istanbul ignore file */

// declarative file

// @NOTE - NOT TESTED
// LayoutBackofficeComponent is only used in the Exploit FCp/FCA APPs
// It should be removed and replaced by a generic DSFR Layout
import React from 'react';
import { Outlet } from 'react-router-dom';

export const LayoutBackofficeComponent = React.memo(() => (
  <div className="text-center" id="application-container">
    <div id="application-page">
      <Outlet />
    </div>
  </div>
));

LayoutBackofficeComponent.displayName = 'LayoutComponent';
