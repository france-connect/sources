import { render } from '@testing-library/react';

import { ConnectTypes } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { LoginConnectHelp } from './login-connect.help';

describe('LoginConnectHelp', () => {
  beforeEach(() => {
    // Given
    jest.mocked(t).mockReturnValue(expect.any(String));
  });

  it('should match snapshot when ConnectType is FranceConnect', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('any-france-connect-mock');

    // When
    const { container, getByText } = render(
      <LoginConnectHelp connectType={ConnectTypes.FRANCE_CONNECT} />,
    );
    const linkElt = getByText('any-france-connect-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('DSFR.button.loginConnect.whatIs', {
      connectType: 'FranceConnect',
    });
    expect(linkElt).toBeInTheDocument();
    expect(linkElt).toHaveAttribute('href', 'https://franceconnect.gouv.fr/');
    expect(linkElt).toHaveAttribute('title', 'any-france-connect-mock');
    expect(linkElt).not.toHaveAttribute('rel');
    expect(linkElt).not.toHaveAttribute('target');
  });

  it('should match snapshot when ConnectType is ProConnect', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('any-pro-connect-mock');

    // When
    const { container, getByText } = render(
      <LoginConnectHelp connectType={ConnectTypes.PRO_CONNECT} />,
    );
    const linkElt = getByText('any-pro-connect-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('DSFR.button.loginConnect.whatIs', {
      connectType: 'ProConnect',
    });
    expect(linkElt).toBeInTheDocument();
    expect(linkElt).toHaveAttribute('href', 'https://proconnect.gouv.fr/');
    expect(linkElt).toHaveAttribute('title', 'any-pro-connect-mock');
    expect(linkElt).not.toHaveAttribute('rel');
    expect(linkElt).not.toHaveAttribute('target');
  });

  it('should match snapshot when showIcon option is true', () => {
    // Given
    const connectTypeMock = Symbol('any-connect-type-value') as unknown as ConnectTypes;
    jest
      .mocked(t)
      .mockReturnValueOnce('any-new-window-mock')
      .mockReturnValueOnce('any-connect-type-mock');

    // When
    const { container, getByText } = render(
      <LoginConnectHelp showIcon connectType={connectTypeMock} />,
    );
    const linkElt = getByText('any-connect-type-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(linkElt).toBeInTheDocument();
    expect(linkElt).toHaveAttribute('rel', 'noreferrer');
    expect(linkElt).toHaveAttribute('target', '_blank');
    expect(linkElt).toHaveAttribute('title', 'any-connect-type-mock - any-new-window-mock');
  });
});
