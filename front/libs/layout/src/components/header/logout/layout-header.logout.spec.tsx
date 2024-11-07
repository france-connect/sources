import { fireEvent, render } from '@testing-library/react';

import { redirectToUrl } from '@fc/routing';

import { LayoutHeaderLogoutButton } from './layout-header.logout';

describe('LayoutHeaderLogoutButton', () => {
  const endSessionUrlMock = 'any endSessionUrl mock';

  it('should match the snapshot', () => {
    // When
    const { container, getByText } = render(
      <LayoutHeaderLogoutButton endSessionUrl={endSessionUrlMock} />,
    );
    const element = getByText('Se déconnecter');

    // Then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('fr-btn fr-icon-logout-box-r-line');
    expect(container.firstChild).toHaveAttribute('href', endSessionUrlMock);
    expect(container.firstChild).toHaveAttribute(
      'title',
      'bouton permettant la déconnexion de votre compte',
    );
  });

  it('should clear the localStorage', () => {
    // Given
    const clearSpy = jest.spyOn(Storage.prototype, 'clear');

    // When
    const { getByText } = render(<LayoutHeaderLogoutButton endSessionUrl={endSessionUrlMock} />);

    const logoutButton = getByText('Se déconnecter');
    fireEvent.click(logoutButton);

    // Then
    expect(clearSpy).toHaveBeenCalledOnce();
    expect(redirectToUrl).toHaveBeenCalledOnce();
    expect(redirectToUrl).toHaveBeenCalledWith(endSessionUrlMock);
  });
});
