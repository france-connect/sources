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
  // given
  const ConnectValidatorMock = { validate: jest.fn() };
  const Provider = () => (
    <AccountProvider validator={ConnectValidatorMock}>
      <div data-testid="ChildComponent" />
    </AccountProvider>
  );

  beforeEach(() => {
    // given
    const endpoint = '/any-account-endpoints-me-mock';
    jest.mocked(ConfigService.get).mockReturnValue({ endpoints: { me: endpoint } });
    jest.mocked(useSafeContext).mockReturnValue({ codeError: undefined, hasError: false });
    jest.spyOn(React, 'useState').mockReturnValue([expect.any(Object), jest.fn()]);
  });

  it('should render the child component', () => {
    // when
    const { container, getByTestId } = render(<Provider />);
    const element = getByTestId('ChildComponent');

    // then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
  });

  it('should retrieve the account config', () => {
    // when
    render(<Provider />);

    // then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Account');
  });

  it('should retrieve api call errors', () => {
    // when
    render(<Provider />);

    // then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AxiosErrorCatcherContext);
  });

  it('should set the initial state', () => {
    // given
    jest.spyOn(React, 'useState');

    // when
    render(<Provider />);

    // then
    expect(useState).toHaveBeenCalledOnce();
    expect(useState).toHaveBeenCalledWith({
      connected: false,
      expired: false,
      ready: false,
      userinfos: undefined,
    });
  });

  it('should call useEffect twice with differents params', () => {
    // given
    const expired = Symbol('account.state.expired');
    const connected = Symbol('account.state.connected');
    const hasError = Symbol('axioscatcher.state.hasError');

    const useEffectMock = jest.spyOn(React, 'useEffect');
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ connected, expired }, jest.fn()]);
    jest.mocked(useSafeContext).mockReturnValueOnce({ codeError: 'any-error-code-mock', hasError });

    // when
    render(<Provider />);

    // then
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
    // given
    const setAccountMock = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([expect.any(Object), setAccountMock]);
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: {
        me: '/any-account-endpoints-me-mock',
      },
    });

    // when
    const { rerender } = render(<Provider />);
    // @NOTE excessive multiple renders
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);

    // then
    expect(fetchUserInfos).toHaveBeenCalledOnce();
    expect(fetchUserInfos).toHaveBeenCalledWith({
      endpoint: '/any-account-endpoints-me-mock',
      updateState: setAccountMock,
      validator: ConnectValidatorMock,
    });
  });

  it('should upodate the state only once when session has expired', () => {
    // given
    const setAccountMock = jest.fn();
    jest.mocked(useSafeContext).mockReturnValueOnce({ codeError: 401 });
    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([{ connected: true, expired: false }, setAccountMock]);

    // when
    const { rerender } = render(<Provider />);
    // @NOTE excessive multiple renders
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);

    // then
    expect(setAccountMock).toHaveBeenCalledOnce();
    expect(setAccountMock).toHaveBeenCalledWith({
      connected: false,
      expired: true,
      ready: true,
      userinfos: undefined,
    });
  });

  it('should render the provider with account values', () => {
    // given
    const accountStateMock = {
      connected: Symbol('account.state.connected'),
      expired: Symbol('account.state.expired'),
      ready: Symbol('account.state.ready'),
      userinfos: Symbol('account.state.userinfos'),
    };
    jest.spyOn(React, 'useState').mockReturnValueOnce([accountStateMock, jest.fn()]);

    // when
    render(<Provider />);

    // then
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
