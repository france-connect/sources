import classnames from 'classnames';
import React, { useCallback } from 'react';

import type { PropsWithClassName } from '@fc/common';

import { TabDirection, useTabs } from '../../../hooks';
import type { TabGroupItemInterface } from '../../../interfaces';
import { TabComponent } from '../tab/tab.component';

interface TabsGroupComponentProps extends PropsWithClassName {
  items: TabGroupItemInterface[];
  ariaLabel: string;
  dataTestId?: string;
}

export const TabsGroupComponent = React.memo(
  ({ ariaLabel, className, dataTestId = 'TabsGroupComponent', items }: TabsGroupComponentProps) => {
    const { getDirection, selectTab, selectedIndex, tabsRef, tabsStyle } = useTabs(0);

    const handleTabClick = useCallback(
      (index: number) => {
        selectTab(index);
      },
      [selectTab],
    );

    return (
      <div
        ref={tabsRef}
        className={classnames('fr-tabs', className)}
        data-testid={dataTestId}
        style={tabsStyle}>
        <ul aria-label={ariaLabel} className="fr-tabs__list" role="tablist">
          {items.map((item, index) => {
            const isSelected = index === selectedIndex;
            const panelId = `${item.id}-panel`;

            return (
              <TabComponent
                key={item.id}
                className={item.className}
                dataTestId={item.id}
                isSelected={isSelected}
                label={item.label}
                panelId={panelId}
                onClick={() => {
                  handleTabClick(index);
                }}
              />
            );
          })}
        </ul>
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          const panelId = `${item.id}-panel`;
          const direction = getDirection(index);

          return (
            <div
              key={panelId}
              aria-labelledby={item.id}
              className={classnames('fr-tabs__panel', {
                // DSFR classnames
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'fr-tabs__panel--direction-end': direction === TabDirection.END,
                // DSFR classnames
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'fr-tabs__panel--direction-start': direction === TabDirection.START,

                // DSFR classnames
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'fr-tabs__panel--selected': isSelected,
              })}
              data-testid={`${dataTestId}-panel-${item.id}`}
              id={panelId}
              role="tabpanel"
              tabIndex={0}>
              {item.element}
            </div>
          );
        })}
      </div>
    );
  },
);

TabsGroupComponent.displayName = 'TabsGroupComponent';
