import { fireEvent, render } from '@testing-library/react';

import type { TabGroupItemInterface } from '../../../interfaces';
import { TabsGroupComponent } from './tabs-group.component';

describe('TabsGroupComponent', () => {
  // Given
  const mockItems: TabGroupItemInterface[] = [
    {
      element: <p>Content 1</p>,
      id: 'tab-1',
      label: 'Tab 1',
    },
    {
      element: <p>Content 2</p>,
      id: 'tab-2',
      label: 'Tab 2',
    },
    {
      element: <p>Content 3</p>,
      id: 'tab-3',
      label: 'Tab 3',
    },
  ];

  it('should match the snapshot with default values', () => {
    // When
    const { container, getAllByRole, getByRole } = render(
      <TabsGroupComponent ariaLabel="Test tabs system" items={mockItems} />,
    );

    const tablist = getByRole('tablist');
    const tabs = getAllByRole('tab');
    const panels = getAllByRole('tabpanel', { hidden: true });

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-tabs');
    expect(container.firstChild).toHaveAttribute('data-testid', 'TabsGroupComponent');
    expect(tablist).toHaveClass('fr-tabs__list');
    expect(tablist).toHaveAttribute('aria-label', 'Test tabs system');
    expect(tabs).toHaveLength(3);
    expect(panels).toHaveLength(3);

    // First tab should be selected by default
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');

    // First panel should be selected
    expect(panels[0]).toHaveClass('fr-tabs__panel--selected');
    expect(panels[1]).not.toHaveClass('fr-tabs__panel--selected');
    expect(panels[2]).not.toHaveClass('fr-tabs__panel--selected');
  });

  it('should match the snapshot with custom className and dataTestId', () => {
    // When
    const { container } = render(
      <TabsGroupComponent
        ariaLabel="Custom tabs"
        className="custom-tabs-class"
        dataTestId="custom-test-id"
        items={mockItems}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-tabs');
    expect(container.firstChild).toHaveClass('custom-tabs-class');
    expect(container.firstChild).toHaveAttribute('data-testid', 'custom-test-id');
  });

  it('should render tabs with correct initial state', () => {
    // When
    const { getAllByRole } = render(<TabsGroupComponent ariaLabel="Test tabs" items={mockItems} />);

    const tabs = getAllByRole('tab');
    const panels = getAllByRole('tabpanel', { hidden: true });

    // Then - Only first tab should be selected initially
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');

    expect(panels[0]).toHaveClass('fr-tabs__panel--selected');
    expect(panels[1]).not.toHaveClass('fr-tabs__panel--selected');
    expect(panels[2]).not.toHaveClass('fr-tabs__panel--selected');
  });

  it('should render correct panel content for each tab', () => {
    // When
    const { getByText } = render(<TabsGroupComponent ariaLabel="Test tabs" items={mockItems} />);

    // Then
    expect(getByText('Content 1')).toBeInTheDocument();
    expect(getByText('Content 2')).toBeInTheDocument();
    expect(getByText('Content 3')).toBeInTheDocument();
  });

  it('should set correct aria-controls and aria-labelledby attributes', () => {
    // When
    const { getAllByRole } = render(<TabsGroupComponent ariaLabel="Test tabs" items={mockItems} />);

    const tabs = getAllByRole('tab');
    const panels = getAllByRole('tabpanel', { hidden: true });

    // Then
    tabs.forEach((tab, index) => {
      const tabId = mockItems[index].id;
      const panelId = `${tabId}-panel`;

      expect(tab).toHaveAttribute('data-testid', tabId);
      expect(tab).toHaveAttribute('aria-controls', panelId);
      expect(panels[index]).toHaveAttribute('id', panelId);
      expect(panels[index]).toHaveAttribute('aria-labelledby', tabId);
    });
  });

  it('should apply custom className to tab items', () => {
    // Given
    const itemsWithClassName: TabGroupItemInterface[] = [
      {
        className: 'custom-tab-1',
        element: <p>Content 1</p>,
        id: 'tab-1',
        label: 'Tab 1',
      },
      {
        className: 'custom-tab-2',
        element: <p>Content 2</p>,
        id: 'tab-2',
        label: 'Tab 2',
      },
    ];

    // When
    const { getAllByRole } = render(
      <TabsGroupComponent ariaLabel="Test tabs" items={itemsWithClassName} />,
    );

    const tabs = getAllByRole('tab');

    // Then
    expect(tabs[0]).toHaveClass('custom-tab-1');
    expect(tabs[1]).toHaveClass('custom-tab-2');
  });

  it('should change selected tab when clicking on second tab', () => {
    // When
    const { getAllByRole } = render(<TabsGroupComponent ariaLabel="Test tabs" items={mockItems} />);
    const tabs = getAllByRole('tab');
    const panels = getAllByRole('tabpanel', { hidden: true });
    fireEvent.click(tabs[1]);

    // Then
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(panels[0]).not.toHaveClass('fr-tabs__panel--selected');
    expect(panels[1]).toHaveClass('fr-tabs__panel--selected');
  });

  it('should change selected tab when clicking on third tab', () => {
    // When
    const { getAllByRole } = render(<TabsGroupComponent ariaLabel="Test tabs" items={mockItems} />);
    const tabs = getAllByRole('tab');
    const panels = getAllByRole('tabpanel', { hidden: true });
    fireEvent.click(tabs[2]);

    // Then
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(panels[0]).not.toHaveClass('fr-tabs__panel--selected');
    expect(panels[2]).toHaveClass('fr-tabs__panel--selected');
  });

  it('should apply direction-end class to panels after selected panel', () => {
    // When
    const { getAllByRole } = render(<TabsGroupComponent ariaLabel="Test tabs" items={mockItems} />);
    const panels = getAllByRole('tabpanel', { hidden: true });

    // Then
    expect(panels[0]).toHaveClass('fr-tabs__panel--selected');
    expect(panels[0]).not.toHaveClass('fr-tabs__panel--direction-start');
    expect(panels[0]).not.toHaveClass('fr-tabs__panel--direction-end');
    expect(panels[1]).toHaveClass('fr-tabs__panel--direction-end');
    expect(panels[2]).toHaveClass('fr-tabs__panel--direction-end');
  });

  it('should apply direction-start class to panels before selected panel when clicking second tab', () => {
    // When
    const { getAllByRole } = render(<TabsGroupComponent ariaLabel="Test tabs" items={mockItems} />);
    const tabs = getAllByRole('tab');
    const panels = getAllByRole('tabpanel', { hidden: true });
    fireEvent.click(tabs[1]);

    // Then
    expect(panels[0]).toHaveClass('fr-tabs__panel--direction-start');
    expect(panels[1]).toHaveClass('fr-tabs__panel--selected');
    expect(panels[1]).not.toHaveClass('fr-tabs__panel--direction-start');
    expect(panels[1]).not.toHaveClass('fr-tabs__panel--direction-end');
    expect(panels[2]).toHaveClass('fr-tabs__panel--direction-end');
  });
});
