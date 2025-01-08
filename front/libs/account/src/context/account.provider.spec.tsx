import { render } from '@testing-library/react';
import React, { useState } from 'react';

import { AxiosErrorCatcherContext } from '@fc/axios-error-catcher';
import { useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';

import { fetchUserInfos } from '../services';
import { AccountContext } from './account.context';
import { AccountProvider } from './account.provider';

jest.mock('./account.context');
jest.mock('./../services/user-infos/user-infos.service');

describe('AccountProvider', () => {
  // Given
  const ConnectValidatorMock = { validate: jest.fn() };
  const Provider = () => (
    <AccountProvider validator={ConnectValidatorMock}>
      <div data-testid="ChildComponent" />
    </AccountProvider>
  );

  beforeEach(() => {
    // Given
    const endpoint = '/any-account-endpoints-me-mock';
    jest.mocked(ConfigService.get).mockReturnValue({ endpoints: { me: endpoint } });
    jest.mocked(useSafeContext).mockReturnValue({ codeError: undefined, hasError: false });
    jest.spyOn(React, 'useState').mockReturnValue([expect.any(Object), jest.fn()]);
  });

  it('should render the child component if account has been loaded', () => {
    // Given
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ ready: true }, jest.fn()]);

    // When
    const { container, getByTestId } = render(<Provider />);
    const element = getByTestId('ChildComponent');

    // Then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
  });

  it('should not render the child component if account has not been loaded', () => {
    // Given
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ ready: false }, jest.fn()]);

    // When / then
    expect(() => {
      const { getByTestId } = render(<Provider />);
      getByTestId('ChildComponent');
    }).toThrow();
  });

  it('should retrieve the account config', () => {
    // When
    render(<Provider />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Account');
  });

  it('should retrieve api call errors', () => {
    // When
    render(<Provider />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AxiosErrorCatcherContext);
  });

  it('should set the initial state', () => {
    // Given
    jest.spyOn(React, 'useState');

    // When
    render(<Provider />);

    // Then
    expect(useState).toHaveBeenCalledOnce();
    expect(useState).toHaveBeenCalledWith({
      connected: false,
      expired: false,
      ready: false,
      userinfos: undefined,
    });
  });

  it('should call useEffect twice with differents params', () => {
    // Given
    const expired = Symbol('account.state.expired');
    const connected = Symbol('account.state.connected');
    const hasError = Symbol('axioscatcher.state.hasError');

    const useEffectMock = jest.spyOn(React, 'useEffect');
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ connected, expired }, jest.fn()]);
    jest.mocked(useSafeContext).mockReturnValueOnce({ codeError: 'any-error-code-mock', hasError });

    // When
    render(<Provider />);

    // Then
    expect(useEffectMock).toHaveBeenCalledTimes(2);
    // @NOTE first call is for fetchUserInfos
    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);
    // @NOTE second call is for session expiration
    expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
      expired,
      connected,
      'any-error-code-mock',
      hasError,
    ]);
  });

  it('should call fetch user infos only at first render', () => {
    // Given
    const setAccountMock = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([expect.any(Object), setAccountMock]);
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: {
        me: '/any-account-endpoints-me-mock',
      },
    });

    // When
    const { rerender } = render(<Provider />);
    // @NOTE excessive multiple renders
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);

    // Then
    expect(fetchUserInfos).toHaveBeenCalledOnce();
    expect(fetchUserInfos).toHaveBeenCalledWith({
      endpoint: '/any-account-endpoints-me-mock',
      updateState: setAccountMock,
      validator: ConnectValidatorMock,
    });
  });

  it('should upodate the state only once when session has expired', () => {
    // Given
    const setAccountMock = jest.fn();
    jest.mocked(useSafeContext).mockReturnValueOnce({ codeError: 401 });
    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([{ connected: true, expired: false }, setAccountMock]);

    // When
    const { rerender } = render(<Provider />);
    // @NOTE excessive multiple renders
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);

    // Then
    expect(setAccountMock).toHaveBeenCalledOnce();
    expect(setAccountMock).toHaveBeenCalledWith({
      connected: false,
      expired: true,
      ready: true,
      userinfos: undefined,
    });
  });

  it('should render the provider with account values', () => {
    // Given
    const accountStateMock = {
      connected: Symbol('account.state.connected'),
      expired: Symbol('account.state.expired'),
      ready: Symbol('account.state.ready'),
      userinfos: Symbol('account.state.userinfos'),
    };
    jest.spyOn(React, 'useState').mockReturnValueOnce([accountStateMock, jest.fn()]);

    // When
    render(<Provider />);

    // Then
    expect(AccountContext.Provider).toHaveBeenCalledOnce();
    expect(AccountContext.Provider).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        value: accountStateMock,
      },
      {},
    );
  });
});
