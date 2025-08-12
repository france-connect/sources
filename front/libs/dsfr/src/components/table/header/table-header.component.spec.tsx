import { render } from '@testing-library/react';

import { TableHeaderComponent } from './table-header.component';

describe('TableHeaderComponent', () => {
  // Given
  const table = document.createElement('table');
  const columnsMock = [
    {
      key: 'column1',
      label: 'column-mock-1',
    },
    {
      key: 'column2',
      label: 'column-mock-2',
    },
    {
      key: 'column3',
      label: 'column-mock-3',
    },
  ];

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <TableHeaderComponent className="any-classname-mock" columns={columnsMock} />,
      { container: document.body.appendChild(table) },
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot without classnames', () => {
    // When
    const { container } = render(<TableHeaderComponent columns={columnsMock} />, {
      container: document.body.appendChild(table),
    });

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should set the classname to the container', () => {
    // When
    const { container } = render(
      <TableHeaderComponent className="any-classname-mock" columns={columnsMock} />,
      { container: document.body.appendChild(table) },
    );

    // Then
    expect(container.firstChild).toHaveClass('any-classname-mock');
  });

  it('should create 3 columns in the table header', () => {
    // When
    const { container, getByText } = render(
      <TableHeaderComponent className="any-classname-mock" columns={columnsMock} />,
      { container: document.body.appendChild(table) },
    );
    const thElements = container.querySelectorAll('th');
    const col1Element = getByText('column-mock-1');
    const col2Element = getByText('column-mock-2');
    const col3Element = getByText('column-mock-3');

    // Then
    expect(thElements).toHaveLength(3);
    expect(col1Element).toBeInTheDocument();
    expect(thElements.item(0)).toBe(col1Element);
    expect(col2Element).toBeInTheDocument();
    expect(thElements.item(1)).toBe(col2Element);
    expect(col3Element).toBeInTheDocument();
    expect(thElements.item(2)).toBe(col3Element);
  });
});
