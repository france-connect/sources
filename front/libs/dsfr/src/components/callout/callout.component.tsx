import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';

import type { PropsWithClassName } from '@fc/common';
import { HeadingTag } from '@fc/common';

import { Sizes } from '../../enums';

interface CalloutComponentProps extends Required<PropsWithChildren>, PropsWithClassName {
  title: string;
  dataTestId?: string;
  heading?: HeadingTag;
  size?: Omit<Sizes, Sizes.LARGE>;
  icon?: string;
}

export const CalloutComponent = React.memo(
  ({
    children,
    className,
    dataTestId,
    heading: Heading = HeadingTag.H3,
    icon = undefined,
    size = Sizes.MEDIUM,
    title,
  }: CalloutComponentProps) => (
    <div
      className={classnames(
        className,
        {
          [`fr-icon-${icon}`]: icon,
        },
        `fr-callout fr-callout--${size}`,
      )}
      data-testid={dataTestId}>
      <Heading className="fr-callout__title">{title}</Heading>
      {children}
    </div>
  ),
);

CalloutComponent.displayName = 'CalloutComponent';
