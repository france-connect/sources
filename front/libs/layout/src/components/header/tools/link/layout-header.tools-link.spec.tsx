import { render } from '@testing-library/react';

import { LayoutHeaderToolsLink } from './layout-header.tools-link';

describe('LayoutHeaderToolsLink', () => {
  it('should match the snapshot, with minimal props', () => {
    // When
    const { container } = render(
      <LayoutHeaderToolsLink href="/any-href-mock" label="any label mock" title="any title mock" />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with icon and dataTestId', () => {
    // When
    const { container } = render(
      <LayoutHeaderToolsLink
        dataTestId="any-data-testid-mock"
        href="/any-href-mock"
        icon="any-icon-mock"
        label="any label mock"
        title="any title mock"
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with external true', () => {
    // When
    const { container } = render(
      <LayoutHeaderToolsLink
        external
        href="/any-href-mock"
        label="any label mock"
        title="any title mock"
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the label inside the link', () => {
    // When
    const { getByText } = render(
      <LayoutHeaderToolsLink href="/any-href-mock" label="any label mock" title="any title mock" />,
    );
    const labelElement = getByText('any label mock');

    // Then
    expect(labelElement).toBeInTheDocument();
  });
});
