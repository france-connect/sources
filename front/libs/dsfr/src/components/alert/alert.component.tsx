import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React, { useCallback } from 'react';

import type { PropsWithClassName } from '@fc/common';
import { HeadingTag, MessageTypes, Strings } from '@fc/common';
import { t } from '@fc/i18n';

import { Sizes } from '../../enums';

interface AlertComponentProps extends PropsWithClassName, PropsWithChildren {
  // @NOTE [RGAA] moves the focus onto the alert, the browser scrolls it into view
  // and assistive technologies announce its content
  // - should be defined if the Component renders the outcome of a user action
  // - should NOT be defined for a static alert, it would steal the focus on page load
  autoFocus?: boolean;
  // @NOTE [DSFR] attribute role="alert"
  // - should be defined if the Component is injected dynamicly into the page
  // - should NOT be defined if the Component is not injected dynamicly into the page
  noRole?: boolean;
  size?: Omit<Sizes, Sizes.LARGE>;
  type?: MessageTypes;
  title?: string;
  // @NOTE TS Omit(H1) issued with HeadingTag's type
  heading?: HeadingTag.H2 | HeadingTag.H3 | HeadingTag.H4 | HeadingTag.H5 | HeadingTag.H6;
  icon?: string;
  onClose?: () => void;
  dataTestId?: string;
}

export const AlertComponent = React.memo(
  ({
    autoFocus = false,
    children: description,
    className,
    dataTestId = 'AlertComponent',
    heading: Heading = HeadingTag.H3,
    icon,
    noRole = false,
    onClose,
    size = Sizes.MEDIUM,
    title,
    type = MessageTypes.INFO,
  }: AlertComponentProps) => {
    const closeLabel = (onClose && t('DSFR.alert.close')) || undefined;

    // @NOTE the callback ref must stay stable, an inline one would refocus on every render
    const focusAlert = useCallback(
      (element: HTMLDivElement | null) => {
        if (autoFocus && element) {
          element.focus();
        }
      },
      [autoFocus],
    );

    return (
      <div
        ref={focusAlert}
        className={classnames(
          className,
          `fr-alert fr-alert--${type} fr-alert--${size} ${icon ?? Strings.EMPTY_STRING}`,
        )}
        data-testid={dataTestId}
        role={noRole ? undefined : 'alert'}
        tabIndex={autoFocus ? -1 : undefined}>
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
