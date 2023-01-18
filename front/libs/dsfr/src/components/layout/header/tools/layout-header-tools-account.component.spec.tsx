// @see _doc/jest.md
import { render } from '@testing-library/react';

import { LayoutHeaderToolsAccountComponent } from './layout-header-tools-account.component';

describe('LayoutHeaderToolsAccountComponent', () => {
  it('should match the snapshot, when isMobile true', () => {
    // when
    const { container } = render(
      <LayoutHeaderToolsAccountComponent
        isMobile
        firstname="any-firstname-mock"
        lastname="any-lastname-mock"
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when isMobile false', () => {
    // when
    const { container } = render(
      <LayoutHeaderToolsAccountComponent
        firstname="any-firstname-mock"
        isMobile={false}
        lastname="any-lastname-mock"
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render lastname', () => {
    // when
    const { getByText } = render(
      <LayoutHeaderToolsAccountComponent
        isMobile
        firstname="any-firstname-mock"
        lastname="any-lastname-mock"
      />,
    );
    const element = getByText(/any-lastname-mock/);

    // then
    expect(element).toBeInTheDocument();
  });

  it('should render firstname', () => {
    // when
    const { getByText } = render(
      <LayoutHeaderToolsAccountComponent
        isMobile
        firstname="any-firstname-mock"
        lastname="any-lastname-mock"
      />,
    );
    const element = getByText(/any-firstname-mock/);

    // then
    expect(element).toBeInTheDocument();
  });
});
