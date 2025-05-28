import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { ButtonTypes, ConnectTypes, LoginConnectComponent } from '@fc/dsfr';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: { login: 'login-url-mock' },
    });
  });

  it('should match the snapshot as FranceConnect', () => {
    // When
    const { container } = render(<LoginFormComponent connectType={ConnectTypes.FRANCE_CONNECT} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot as ProConnect', () => {
    // When
    const { container } = render(<LoginFormComponent connectType={ConnectTypes.FRANCE_CONNECT} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call ConfigService.get with AccountConfig.CONFIG_NAME', () => {
    // When
    render(<LoginFormComponent connectType={ConnectTypes.FRANCE_CONNECT} />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledWith('Account');
  });

  it('should render a form with params', () => {
    // When
    const { getByTestId } = render(
      <LoginFormComponent connectType={ConnectTypes.FRANCE_CONNECT} />,
    );
    const formElement = getByTestId('login-form-component');

    // Then
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute('method', 'get');
    expect(formElement).toHaveAttribute('action', 'login-url-mock');
  });

  it('should render an input with the redirectUrl', () => {
    // When
    const { getByDisplayValue } = render(
      <LoginFormComponent
        connectType={ConnectTypes.FRANCE_CONNECT}
        redirectUrl="/any-login-callback-url"
      />,
    );
    const element = getByDisplayValue('/any-login-callback-url');

    // Then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('name', 'redirectUrl');
    expect(element).toHaveAttribute('type', 'hidden');
  });

  it('should render the LoginConnectComponent as FranceConnect', () => {
    // When
    render(<LoginFormComponent connectType={ConnectTypes.FRANCE_CONNECT} />);

    // Then
    expect(LoginConnectComponent).toHaveBeenCalledOnce();
    expect(LoginConnectComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        connectType: 'FranceConnect',
        showHelp: false,
        type: ButtonTypes.SUBMIT,
      }),
      undefined,
    );
  });

  it('should render the LoginConnectComponent as ProConnect and showHelp as true', () => {
    // When
    render(<LoginFormComponent showHelp connectType={ConnectTypes.PRO_CONNECT} />);

    // Then
    expect(LoginConnectComponent).toHaveBeenCalledOnce();
    expect(LoginConnectComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        connectType: 'ProConnect',
        showHelp: true,
        type: ButtonTypes.SUBMIT,
      }),
      undefined,
    );
  });

  it('should render the LoginConnectComponent with a className', () => {
    // When
    render(
      <LoginFormComponent
        className="any-className-mock"
        connectType={ConnectTypes.FRANCE_CONNECT}
      />,
    );

    // Then
    expect(LoginConnectComponent).toHaveBeenCalledOnce();
    expect(LoginConnectComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'any-className-mock',
        connectType: 'FranceConnect',
        showHelp: false,
        type: ButtonTypes.SUBMIT,
      }),
      undefined,
    );
  });
});
