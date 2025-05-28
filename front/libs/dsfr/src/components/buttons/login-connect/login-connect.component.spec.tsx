import { render } from '@testing-library/react';

import type { ButtonTypes, ConnectTypes } from '../../../enums';
import { LoginConnectButton } from './button';
import { LoginConnectHelp } from './help';
import { LoginConnectComponent } from './login-connect.component';

jest.mock('./help/login-connect.help');
jest.mock('./button/login-connect.button');

describe('LoginConnectComponent', () => {
  // Given
  const onClickMock = jest.fn();
  const connectTypeMock = Symbol('connectType') as unknown as ConnectTypes;

  it('should match snapshot, with default props', () => {
    // When
    const { container } = render(
      <LoginConnectComponent connectType={connectTypeMock} onClick={onClickMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('data-testid', 'LoginConnectComponent');
    expect(LoginConnectButton).toHaveBeenCalledOnce();
    expect(LoginConnectButton).toHaveBeenCalledWith(
      {
        connectType: connectTypeMock,
        onClick: onClickMock,
        type: 'button',
      },
      undefined,
    );
    expect(LoginConnectHelp).not.toHaveBeenCalled();
  });

  it('should match snapshot, with optionnal props', () => {
    // Given
    const buttonTypeMock = Symbol('button-type-mock') as unknown as ButtonTypes;

    // When
    const { container } = render(
      <LoginConnectComponent
        showHelp
        showIcon
        className="any-classname-mock"
        connectType={connectTypeMock}
        type={buttonTypeMock}
        onClick={onClickMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('data-testid', 'LoginConnectComponent');
    expect(container.firstChild).toHaveClass('fr-connect-group any-classname-mock');
    expect(LoginConnectButton).toHaveBeenCalledOnce();
    expect(LoginConnectButton).toHaveBeenCalledWith(
      {
        connectType: connectTypeMock,
        onClick: onClickMock,
        type: buttonTypeMock,
      },
      undefined,
    );
    expect(LoginConnectHelp).toHaveBeenCalled();
    expect(LoginConnectHelp).toHaveBeenCalledWith(
      {
        connectType: connectTypeMock,
        showIcon: true,
      },
      undefined,
    );
  });
});
