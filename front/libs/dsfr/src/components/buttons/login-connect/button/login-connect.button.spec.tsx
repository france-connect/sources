import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { ButtonTypes, ConnectTypes } from '../../../../enums';
import { LoginConnectButton } from './login-connect.button';

describe('LoginConnectButton', () => {
  beforeEach(() => {
    // Given
    jest.mocked(t).mockReturnValue('any-autheticate-i81n-mock');
  });

  it('shoud match snapshot, with connect type as FranceConnect', () => {
    // Given
    // When
    const { container, getByText } = render(
      <LoginConnectButton connectType={ConnectTypes.FRANCE_CONNECT} type={ButtonTypes.BUTTON} />,
    );
    const connectLabelElt = getByText('FranceConnect');
    const authenticateLabelElt = getByText('any-autheticate-i81n-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('type', 'button');
    expect(container.firstChild).toHaveClass('fr-connect');
    expect(connectLabelElt).toBeInTheDocument();
    expect(authenticateLabelElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('DSFR.button.loginConnect.authenticateWith');
  });

  it('shoud match snapshot, with connect type as ProConnect', () => {
    // Given
    // When
    const { container, getByText } = render(
      <LoginConnectButton connectType={ConnectTypes.PRO_CONNECT} type={ButtonTypes.BUTTON} />,
    );
    const connectLabelElt = getByText('ProConnect');
    const authenticateLabelElt = getByText('any-autheticate-i81n-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('type', 'button');
    expect(container.firstChild).toHaveClass('fr-connect fr-connect--proconnect');
    expect(connectLabelElt).toBeInTheDocument();
    expect(authenticateLabelElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('DSFR.button.loginConnect.authenticateWith');
  });

  it('shoud match snapshot, with a defined button type', () => {
    // When
    const { container } = render(
      <LoginConnectButton connectType={ConnectTypes.PRO_CONNECT} type={ButtonTypes.RESET} />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('type', 'reset');
  });
});
