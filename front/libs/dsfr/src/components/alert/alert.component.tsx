import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';

import { EventTypes, HeadingTag, type PropsWithClassName } from '@fc/common';
import { t } from '@fc/i18n';

import { Sizes } from '../../enums';

interface AlertComponentProps extends PropsWithClassName, PropsWithChildren {
  // @NOTE [DSFR] attribute role="alert"
  // - should be defined if the Component is injected dynamicly into the page
  // - should NOT be defined if the Component is not injected dynamicly into the page
  noRole?: boolean;
  size?: Omit<Sizes, Sizes.LARGE>;
  type?: EventTypes;
  title?: string;
  // @NOTE TS Omit(H1) issued with HeadingTag's type
  heading?: HeadingTag.H2 | HeadingTag.H3 | HeadingTag.H4 | HeadingTag.H5 | HeadingTag.H6;
  onClose?: () => void;
  dataTestId?: string;
}

export const AlertComponent = React.memo(
  ({
    children: description,
    className,
    dataTestId = 'AlertComponent',
    heading: Heading = HeadingTag.H3,
    noRole = false,
    onClose = undefined,
    size = Sizes.MEDIUM,
    title = undefined,
    type = EventTypes.INFO,
  }: AlertComponentProps) => {
    const closeLabel = (onClose && t('DSFR.alert.close')) || undefined;

    return (
      <div
        className={classnames(className, `fr-alert fr-alert--${type} fr-alert--${size}`)}
        data-testid={dataTestId}
        role={noRole ? undefined : 'alert'}>
        {title && (
          <Heading className="fr-alert__title" data-testid={`${dataTestId}-title`}>
            {title}
          </Heading>
        )}
        {description}
        {!!onClose && (
          <button
            className="fr-link--close fr-link"
            data-testid={`${dataTestId}-close-button`}
            title={closeLabel}
            onClick={onClose}>
            {closeLabel}
          </button>
        )}
      </div>
    );
  },
);

AlertComponent.displayName = 'AlertComponent';
