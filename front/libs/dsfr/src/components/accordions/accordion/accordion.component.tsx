import classnames from 'classnames';
import type * as CSS from 'csstype';
import React, { useCallback, useId } from 'react';

import { HeadingTag, useContentHeight } from '@fc/common';

import { AccordionGroupItemInterface } from '../../../interfaces';

interface AccordionComponentProps extends Omit<AccordionGroupItemInterface, 'id' | 'element'> {
  children?: React.ReactNode;
  onClick: (id: string) => void;
  opened?: boolean;
  id?: string;
  element?: React.ReactElement;
}

export const AccordionComponent: React.FC<AccordionComponentProps> = React.memo(
  ({
    children,
    className,
    element,
    heading: HeadingElement,
    headingClassname,
    id,
    onClick,
    opened,
    title,
    titleClassname,
  }: AccordionComponentProps) => {
    const localId = useId();

    const uniqId = id || localId;
    const dataTestIdPrefix = `AccordionComponent`;
    const dataTestId = `${dataTestIdPrefix}-${uniqId}`;
    const ariaControlId = `accordion-aria-control-${uniqId}`;

    // @SEE https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1147
    const { contentHeight, contentRef } = useContentHeight();

    const contentStyle: CSS.DSFRCustomProperties = {
      // DSFR classname
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--collapse': `-${contentHeight}px`,
      // DSFR classname
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--collapse-max-height': 'none',
    };

    const Heading = HeadingElement || HeadingTag.H3;

    const clickHandler = useCallback(() => {
      onClick(uniqId);
    }, [uniqId, onClick]);

    return (
      <section className={classnames('fr-accordion', className)} data-testid={dataTestId}>
        <Heading
          className={classnames('fr-accordion__title', headingClassname)}
          data-testid={`${dataTestIdPrefix}-heading`}>
          <button
            aria-controls={ariaControlId}
            aria-expanded={opened}
            className={classnames('fr-accordion__btn', titleClassname)}
            data-testid={`${dataTestIdPrefix}-title`}
            onClick={clickHandler}>
            {title}
          </button>
        </Heading>
        <div
          ref={contentRef}
          className={classnames('fr-collapse fr-px-2w', {
            // DSFR classname
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-collapse--expanded': opened,
          })}
          data-testid={`${dataTestIdPrefix}-content`}
          id={ariaControlId}
          style={contentStyle}>
          {element ?? children ?? null}
        </div>
      </section>
    );
  },
);

AccordionComponent.defaultProps = {
  children: undefined,
  element: undefined,
  id: undefined,
  opened: false,
};

AccordionComponent.displayName = 'AccordionComponent';
