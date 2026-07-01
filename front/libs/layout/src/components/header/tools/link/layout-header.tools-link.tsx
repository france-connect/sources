import classnames from 'classnames';
import React from 'react';

import type { ToolsLinkInterface } from '../../../../interfaces';

export const LayoutHeaderToolsLink = React.memo(
  ({ dataTestId, external, href, icon, label, title }: ToolsLinkInterface) => (
    <li>
      <a
        className={classnames('fr-btn', { [`fr-icon-${icon}`]: !!icon })}
        data-testid={dataTestId}
        href={href}
        rel={external ? 'noopener noreferrer external' : undefined}
        target={external ? '_blank' : undefined}
        title={title}>
        {label}
      </a>
    </li>
  ),
);

LayoutHeaderToolsLink.displayName = 'LayoutHeaderToolsLink';
