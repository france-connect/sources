import { render } from '@testing-library/react';

import { LayoutHeaderLogoutButton } from './layout-header.logout';

describe('LayoutHeaderLogoutButton', () => {
  it('should match the snapshot', () => {
    // given
    const endSessionUrlMock = 'any endSessionUrl mock';
    // when
    const { container, getByText } = render(
      <LayoutHeaderLogoutButton endSessionUrl={endSessionUrlMock} />,
    );
    const element = getByText('Se déconnecter');

    // then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('fr-btn fr-icon-logout-box-r-line');
    expect(container.firstChild).toHaveAttribute('href', endSessionUrlMock);
    expect(container.firstChild).toHaveAttribute(
      'title',
      'bouton permettant la déconnexion de votre compte',
    );
  });
});
