import { render } from '@testing-library/react';

import { LayoutHeaderToolsLogoutButton } from './layout-header-tools-logout.button';

describe('LayoutHeaderToolsLogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot, when isMobile is true', () => {
    // when
    const { container } = render(
      <LayoutHeaderToolsLogoutButton isMobile endSessionUrl={expect.any(String)} />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when isMobile is false', () => {
    // when
    const { container } = render(
      <LayoutHeaderToolsLogoutButton endSessionUrl={expect.any(String)} isMobile={false} />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should render a link with an url', () => {
    // when
    const { getByTitle } = render(
      <LayoutHeaderToolsLogoutButton endSessionUrl="any-endSessionUrl-mock" isMobile={false} />,
    );
    const element = getByTitle('bouton permettant la déconnexion de votre compte');
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('href', 'any-endSessionUrl-mock');
  });
});
