import classnames from 'classnames';
import React from 'react';

import type { SelectedItemsHook } from '@fc/common';
import { useSelectedItems } from '@fc/common';

import type { AccordionGroupItemInterface } from '../../../interfaces';
import { AccordionComponent } from '../accordion/accordion.component';

interface AccordionGroupComponentProps {
  className?: string;
  items: AccordionGroupItemInterface[];
  options?: SelectedItemsHook<string>;
}

export const AccordionGroupComponent = React.memo(
  // @TODO enhance with an items extra options props, like heading, classname...
  ({
    className,
    items,
    options = {
      defaultValues: [],
      multiple: false,
    },
  }: AccordionGroupComponentProps) => {
    const { onItemSelect, selected } = useSelectedItems(options);

    return (
      <div className={classnames('fr-accordions-group', className)}>
        {items.map((item) => {
          const isOpened = selected.includes(item.id);
          return (
            <AccordionComponent
              key={item.id}
              className={item.className}
              element={item.element}
              heading={item.heading}
              headingClassname={item.headingClassname}
              id={item.id}
              opened={isOpened}
              title={item.title}
              titleClassname={item.titleClassname}
              onClick={onItemSelect}
            />
          );
        })}
      </div>
    );
  },
);

AccordionGroupComponent.displayName = 'AccordionGroupComponent';
