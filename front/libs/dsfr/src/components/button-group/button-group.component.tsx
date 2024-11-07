import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React, { Children } from 'react';

import { Sizes } from '../../enums';

interface ButtonGroupComponentProps extends PropsWithChildren {
  size?: Sizes;
  inline?: boolean;
  equisized?: boolean;
}

export const ButtonGroupComponent = React.memo(
  ({
    children,
    equisized = false,
    inline = true,
    size = Sizes.MEDIUM,
  }: ButtonGroupComponentProps) => (
    <ul
      className={classnames('fr-btns-group', {
        [`fr-btns-group--inline-${size}`]: inline,
        [`fr-btns-group--${size}`]: !inline,
        // css class from DSFR
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-btns-group--equisized': equisized,
      })}>
      {Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </ul>
  ),
);

ButtonGroupComponent.displayName = 'ButtonGroupComponent';
