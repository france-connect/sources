import classnames from 'classnames';
import React from 'react';

interface TabComponentProps {
  dataTestId: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  panelId: string;
  className?: string;
}

export const TabComponent = React.memo(
  ({ className, dataTestId, isSelected, label, onClick, panelId }: TabComponentProps) => (
    <li role="presentation">
      <button
        aria-controls={panelId}
        aria-selected={isSelected}
        className={classnames('fr-tabs__tab', className)}
        data-testid={dataTestId}
        role="tab"
        tabIndex={isSelected ? 0 : -1}
        type="button"
        onClick={onClick}>
        {label}
      </button>
    </li>
  ),
);

TabComponent.displayName = 'TabComponent';
