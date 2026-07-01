import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React, { Children } from 'react';

import type { IconPlacement } from '../../enums';
import { Align, Sizes } from '../../enums';

interface ButtonGroupComponentProps extends PropsWithChildren {
  size?: Sizes;
  inline?: boolean;
  align?: Align;
  equisized?: boolean;
  iconPlacement?: IconPlacement | undefined;
}

export const ButtonGroupComponent = React.memo(
  ({
    align = Align.LEFT,
    children,
    equisized = false,
    iconPlacement,
    inline = true,
    size = Sizes.MEDIUM,
  }: ButtonGroupComponentProps) => {
    const hasOnlyOneElement = Children.count(children) === 1;

    const ParentTag = hasOnlyOneElement ? 'div' : 'ul';

    const Elements = hasOnlyOneElement
      ? Children.only(children)
      : Children.map(children, (child) => <li>{child}</li>);

    return (
      <ParentTag
        className={classnames(`fr-btns-group fr-btns-group--${align}`, {
          // css class from DSFR
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-btns-group--equisized': equisized,
          [`fr-btns-group--${size}`]: !inline,
          [`fr-btns-group--icon-${iconPlacement}`]: !!iconPlacement,
          // css class from DSFR
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-btns-group--inline': inline,
        })}>
        {Elements}
      </ParentTag>
    );
  },
);

ButtonGroupComponent.displayName = 'ButtonGroupComponent';
