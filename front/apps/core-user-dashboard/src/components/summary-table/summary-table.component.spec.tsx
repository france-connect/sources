import { render } from '@testing-library/react';

import { SummaryTableComponent } from './summary-table.component';

describe('SummaryTableComponent', () => {
  // Given
  const sourcesMock = [
    { label: 'any-label-1-mock', value: 'any-value-1-mock' },
    { label: 'any-label-2-mock', value: 'any-value-2-mock' },
  ];

  it('should match the snapshot with required props', () => {
    // When
    const { container } = render(
      <SummaryTableComponent caption="any-caption-mock" id="any-id-mock" sources={sourcesMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with multiline', () => {
    // When
    const { container } = render(
      <SummaryTableComponent
        multiline
        caption="any-caption-mock"
        id="any-id-mock"
        sources={sourcesMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the caption and id', () => {
    // When
    const { container, getByText } = render(
      <SummaryTableComponent caption="any-caption-mock" id="any-id-mock" sources={sourcesMock} />,
    );
    const captionElt = getByText('any-caption-mock');

    // Then
    expect(captionElt).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('id', 'any-id-mock');
  });

  it('should render sources with label and value', () => {
    // When
    const { getByText } = render(
      <SummaryTableComponent caption="any-caption-mock" id="any-id-mock" sources={sourcesMock} />,
    );

    // Then
    expect(getByText('any-label-1-mock')).toBeInTheDocument();
    expect(getByText('any-value-1-mock')).toBeInTheDocument();
    expect(getByText('any-label-2-mock')).toBeInTheDocument();
    expect(getByText('any-value-2-mock')).toBeInTheDocument();
  });

  it('should not render a value cell when value is undefined', () => {
    // When
    const { container, getByText, queryByText } = render(
      <SummaryTableComponent
        caption="any-caption-mock"
        id="any-id-mock"
        sources={[{ label: 'any-label-only-mock' }]}
      />,
    );
    const rowElt = container.querySelector('tr');

    // Then
    expect(getByText('any-label-only-mock')).toBeInTheDocument();
    expect(queryByText('any-value-1-mock')).not.toBeInTheDocument();
    expect(rowElt?.querySelectorAll('td')).toHaveLength(1);
  });

  it('should apply fr-table--multiline class when multiline is true', () => {
    // When
    const { container } = render(
      <SummaryTableComponent
        multiline
        caption="any-caption-mock"
        id="any-id-mock"
        sources={sourcesMock}
      />,
    );

    // Then
    expect(container.firstChild).toHaveClass('fr-table');
    expect(container.firstChild).toHaveClass('fr-table--multiline');
  });

  it('should not apply fr-table--multiline class by default', () => {
    // When
    const { container } = render(
      <SummaryTableComponent caption="any-caption-mock" id="any-id-mock" sources={sourcesMock} />,
    );

    // Then
    expect(container.firstChild).toHaveClass('fr-table');
    expect(container.firstChild).not.toHaveClass('fr-table--multiline');
  });

  it('should set data-row-key and id on each row', () => {
    // When
    const { container } = render(
      <SummaryTableComponent caption="any-caption-mock" id="any-id-mock" sources={sourcesMock} />,
    );
    const rows = container.querySelectorAll('tbody tr');

    // Then
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveAttribute('data-row-key', '0');
    expect(rows[0]).toHaveAttribute('id', 'any-id-mock-row-key-0');
    expect(rows[1]).toHaveAttribute('data-row-key', '1');
    expect(rows[1]).toHaveAttribute('id', 'any-id-mock-row-key-1');
  });
});
