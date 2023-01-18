import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { AccountService } from '../services/account.service';
import { AccountContext } from './account.context';
import { AccountProvider } from './account.provider';

jest.mock('./../services/account.service');

const configMock = {
  csrf: 'secretCsrf',
  endpoints: {
    login: '/login/endpoint',
    logout: '/logout/endpoint',
    me: '/me/endpoint',
  },
};

describe('AccountProvider', () => {
  it('should render the child component', () => {
    // given
    const theProvider = (
      <AccountProvider config={{ ...configMock }}>
        <div>the children</div>
      </AccountProvider>
    );

    // when
    const { getByText } = render(theProvider);
    const element = getByText('the children');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should call AccountService.fetchData only once at first render', () => {
    // when
    const theProvider = (
      <AccountProvider config={{ ...configMock }}>
        <div>the children</div>
      </AccountProvider>
    );
    const { rerender } = render(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);

    // then
    expect(AccountService.fetchData).toHaveBeenCalledTimes(1);
    expect(AccountService.fetchData).toHaveBeenCalledWith('/me/endpoint', expect.any(Function));
  });

  it('should call AccountService.fetchData only once either url has changed', () => {
    // when
    const { rerender } = render(
      <AccountProvider config={{ ...configMock }}>
        <div>the children</div>
      </AccountProvider>,
    );
    rerender(
      <AccountProvider config={{ ...configMock }}>
        <div>the children</div>
      </AccountProvider>,
    );

    // then
    expect(AccountService.fetchData).toHaveBeenCalledTimes(1);
    expect(AccountService.fetchData).toHaveBeenCalledWith('/me/endpoint', expect.any(Function));
  });

  it('should call AccountService.fetchData only once at first render with an useCallback as parameter', () => {
    // given
    const setStateMock = jest.fn();
    const useCallbackMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockImplementationOnce(() => useCallbackMock);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [expect.any(Object), setStateMock]);

    // when
    const theProvider = (
      <AccountProvider config={{ ...configMock }}>
        <div>the children</div>
      </AccountProvider>
    );
    const { rerender } = render(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);

    // then
    expect(AccountService.fetchData).toHaveBeenCalledTimes(1);
    expect(AccountService.fetchData).toHaveBeenCalledWith('/me/endpoint', useCallbackMock);
  });

  it('should call the provider updateAccount callback hook handler while any consumer using it', () => {
    // given
    const theUpdateMock = { thekey: 'thekey' };
    const useCallbackMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockImplementationOnce(() => useCallbackMock);

    // when
    const { getByRole } = render(
      <AccountProvider config={{ ...configMock }}>
        <AccountContext.Consumer>
          {({ updateAccount }) => (
            <button
              type="button"
              onClick={() => {
                updateAccount(theUpdateMock);
              }}>
              the button
            </button>
          )}
        </AccountContext.Consumer>
      </AccountProvider>,
    );
    const theButton = getByRole('button');
    fireEvent.click(theButton);

    // then
    expect(useCallbackMock).toHaveBeenCalledTimes(1);
    expect(useCallbackMock).toHaveBeenCalledWith(theUpdateMock);
  });

  it('should call setState handler as a callback of any AccountContext.Consumer', () => {
    // given
    const theUpdateMock = { thekey: 'thekey' };
    const stateMock = { thebase: 'thebase', thekey: undefined };
    const setStateMock = jest.fn();
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [stateMock, setStateMock]);

    // when
    const { getByRole } = render(
      <AccountProvider config={{ ...configMock }}>
        <AccountContext.Consumer>
          {({ updateAccount }) => (
            <button
              type="button"
              onClick={() => {
                updateAccount(theUpdateMock);
              }}>
              the button
            </button>
          )}
        </AccountContext.Consumer>
      </AccountProvider>,
    );
    const theButton = getByRole('button');
    fireEvent.click(theButton);

    // then
    expect(setStateMock).toHaveBeenCalledTimes(1);
    expect(setStateMock).toHaveBeenCalledWith({ ...stateMock, ...theUpdateMock });
  });
});
