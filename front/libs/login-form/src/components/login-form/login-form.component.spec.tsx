import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { ButtonTypes, ConnectTypes, LoginConnectButton } from '@fc/dsfr';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  beforeEach(() => {
    // given
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: { login: 'login-url-mock' },
    });
  });

  it('should match the snapshot as FranceConnect', () => {
    // when
    const { container } = render(<LoginFormComponent connectType={ConnectTypes.FRANCE_CONNECT} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot as AgentConnect', () => {
    // when
    const { container } = render(<LoginFormComponent connectType={ConnectTypes.FRANCE_CONNECT} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call ConfigService.get with AccountConfig.CONFIG_NAME', () => {
    // when
    render(<LoginFormComponent connectType={ConnectTypes.FRANCE_CONNECT} />);

    // then
    expect(ConfigService.get).toHaveBeenCalledWith('Account');
  });

  it('should render a form with params', () => {
    // when
    const { getByTestId } = render(
      <LoginFormComponent connectType={ConnectTypes.FRANCE_CONNECT} />,
    );
    const formElement = getByTestId('login-form-component');

    // then
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute('method', 'get');
    expect(formElement).toHaveAttribute('action', 'login-url-mock');
  });

  it('should render an input with the redirectUrl', () => {
    // when
    const { getByDisplayValue } = render(
      <LoginFormComponent
        connectType={ConnectTypes.FRANCE_CONNECT}
        redirectUrl="/any-login-callback-url"
      />,
    );
    const element = getByDisplayValue('/any-login-callback-url');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('name', 'redirectUrl');
    expect(element).toHaveAttribute('type', 'hidden');
  });

  it('should render the LoginConnectButton as FranceConnect', () => {
    // when
    render(<LoginFormComponent connectType={ConnectTypes.FRANCE_CONNECT} />);

    // then
    expect(LoginConnectButton).toHaveBeenCalledOnce();
    expect(LoginConnectButton).toHaveBeenCalledWith(
      expect.objectContaining({
        connectType: 'FranceConnect',
        type: ButtonTypes.SUBMIT,
      }),
      {},
    );
  });

  it('should render the LoginConnectButton as AgentConnect', () => {
    // when
    render(<LoginFormComponent connectType={ConnectTypes.AGENT_CONNECT} />);

    // then
    expect(LoginConnectButton).toHaveBeenCalledOnce();
    expect(LoginConnectButton).toHaveBeenCalledWith(
      expect.objectContaining({
        connectType: 'AgentConnect',
        type: ButtonTypes.SUBMIT,
      }),
      {},
    );
  });

  it('should render the LoginConnectButton with a className', () => {
    // when
    render(
      <LoginFormComponent
        className="any-className-mock"
        connectType={ConnectTypes.FRANCE_CONNECT}
      />,
    );

    // then
    expect(LoginConnectButton).toHaveBeenCalledOnce();
    expect(LoginConnectButton).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'any-className-mock',
        connectType: 'FranceConnect',
        type: ButtonTypes.SUBMIT,
      }),
      {},
    );
  });
});
