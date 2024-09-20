import React from 'react';

import { Strings, useSafeContext } from '@fc/common';

import { LayoutContext } from '../../../context';
import type { LayoutContextState } from '../../../interfaces';

export const LayoutHeaderAccountComponent = React.memo(() => {
  const { userinfos } = useSafeContext<LayoutContextState>(LayoutContext);
  if (!userinfos) {
    return null;
  }
  const { firstname, lastname } = userinfos;
  return (
    <span
      className="fr-btn fr-icon-account-line"
      data-testid="layout-header-tools-account-component">
      {`${firstname}${Strings.WHITE_SPACE}${lastname}`}
    </span>
  );
});

LayoutHeaderAccountComponent.displayName = 'LayoutHeaderAccountComponent';
