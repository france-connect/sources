import { fireEvent, render } from '@testing-library/react';

import { TabComponent } from './tab.component';

describe('TabComponent', () => {
  // Given
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot when tab is selected', () => {
    // When
    const { container, getByRole } = render(
      <TabComponent
        isSelected
        dataTestId="tab-1"
        label="Tab 1"
        panelId="panel-1"
        onClick={mockOnClick}
      />,
    );

    const button = getByRole('tab');

    // Then
    expect(container).toMatchSnapshot();
    expect(button).toHaveClass('fr-tabs__tab');
    expect(button).toHaveAttribute('aria-selected', 'true');
    expect(button).toHaveAttribute('aria-controls', 'panel-1');
    expect(button).toHaveAttribute('tabindex', '0');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('Tab 1');
    expect(button).toHaveAttribute('data-testid', 'tab-1');
  });

  it('should match the snapshot when tab is not selected', () => {
    // When
    const { container, getByRole } = render(
      <TabComponent
        dataTestId="tab-2"
        isSelected={false}
        label="Tab 2"
        panelId="panel-2"
        onClick={mockOnClick}
      />,
    );

    const button = getByRole('tab');

    // Then
    expect(container).toMatchSnapshot();
    expect(button).toHaveClass('fr-tabs__tab');
    expect(button).toHaveAttribute('aria-selected', 'false');
    expect(button).toHaveAttribute('aria-controls', 'panel-2');
    expect(button).toHaveAttribute('tabindex', '-1');
    expect(button).toHaveTextContent('Tab 2');
    expect(button).toHaveAttribute('data-testid', 'tab-2');
  });

  it('should call onClick when clicked', () => {
    // When
    const { getByRole } = render(
      <TabComponent
        dataTestId="tab-3"
        isSelected={false}
        label="Tab 3"
        panelId="panel-3"
        onClick={mockOnClick}
      />,
    );

    const button = getByRole('tab');
    fireEvent.click(button);

    // Then
    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it('should apply custom className when provided', () => {
    // When
    const { getByRole } = render(
      <TabComponent
        isSelected
        className="custom-class"
        dataTestId="tab-4"
        label="Tab 4"
        panelId="panel-4"
        onClick={mockOnClick}
      />,
    );

    const button = getByRole('tab');

    // Then
    expect(button).toHaveClass('fr-tabs__tab');
    expect(button).toHaveClass('custom-class');
  });
});
