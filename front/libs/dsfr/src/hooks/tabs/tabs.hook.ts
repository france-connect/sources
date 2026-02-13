import type { CSSProperties } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export const TabDirection = {
  END: 'end',
  START: 'start',
} as const;

export type TabDirectionType = (typeof TabDirection)[keyof typeof TabDirection];

interface TabState {
  selectedIndex: number;
  previousIndex: number;
}

export const useTabs = (initialIndex = 0) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabsHeight, setTabsHeight] = useState<number | null>(null);
  const [tabState, setTabState] = useState<TabState>({
    previousIndex: initialIndex,
    selectedIndex: initialIndex,
  });

  useLayoutEffect(() => {
    if (tabsRef.current) {
      const listElement = tabsRef.current.querySelector('.fr-tabs__list');
      const selectedPanel = tabsRef.current.querySelector('.fr-tabs__panel--selected');

      if (listElement && selectedPanel) {
        const listHeight = listElement.clientHeight;
        const panelHeight = selectedPanel.clientHeight;
        setTabsHeight(listHeight + panelHeight);
      }
    }
  }, [tabState.selectedIndex]);

  const selectTab = useCallback((index: number) => {
    setTabState((prev) => ({
      previousIndex: prev.selectedIndex,
      selectedIndex: index,
    }));
  }, []);

  const getDirection = useCallback(
    (panelIndex: number): TabDirectionType | null => {
      if (panelIndex === tabState.selectedIndex) {
        return null;
      }
      if (panelIndex < tabState.selectedIndex) {
        return TabDirection.START;
      }
      return TabDirection.END;
    },
    [tabState.selectedIndex],
  );

  let tabsStyle: CSSProperties = {};
  if (tabsHeight) {
    // DSFR classnames
    // eslint-disable-next-line @typescript-eslint/naming-convention
    tabsStyle = { '--tabs-height': `${tabsHeight}px` };
  }

  return {
    getDirection,
    selectTab,
    selectedIndex: tabState.selectedIndex,
    tabsRef,
    tabsStyle,
  };
};
