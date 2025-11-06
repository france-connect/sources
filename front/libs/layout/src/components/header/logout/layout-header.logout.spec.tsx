import { fireEvent, render } from '@testing-library/react';

import { t } from '@fc/i18n';
import { redirectToUrl } from '@fc/routing';

import { LayoutHeaderLogoutButton } from './layout-header.logout';

describe('LayoutHeaderLogoutButton', () => {
  const endSessionUrlMock = 'any endSessionUrl mock';

  beforeEach(() => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('bouton permettant la déconnexion de votre compte')
      .mockReturnValueOnce('Se déconnecter');
  });

  it('should call t 2 times with params', () => {
    // When
    render(<LayoutHeaderLogoutButton endSessionUrl={endSessionUrlMock} />);

    // Then
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'Layout.logoutButton.title');
    expect(t).toHaveBeenNthCalledWith(2, 'Layout.logoutButton.label');
  });

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
