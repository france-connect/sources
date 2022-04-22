import { render } from '@testing-library/react';
import React from 'react';

import { UserInfosService } from '../services/user-infos.service';
import { UserInfosProvider } from './user-infos.provider';

jest.mock('./../services/user-infos.service');

describe('UserInfosProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the child component', () => {
    // given
    const theProvider = (
      <UserInfosProvider userInfosEndpoint="any-user-infos-endpoint-mock">
        <div>the children</div>
      </UserInfosProvider>
    );
    // when
    const { getByText } = render(theProvider);
    const element = getByText('the children');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should call UserInfosService.fetchData only once at first render', () => {
    // when
    const theProvider = (
      <UserInfosProvider userInfosEndpoint="any-user-infos-endpoint-mock">
        <div>the children</div>
      </UserInfosProvider>
    );
    const { rerender } = render(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    // then
    expect(UserInfosService.fetchData).toHaveBeenCalledTimes(1);
    expect(UserInfosService.fetchData).toHaveBeenCalledWith(
      'any-user-infos-endpoint-mock',
      expect.any(Function),
    );
  });

  it('should call UserInfosService.fetchData only once either url has changed', () => {
    // when
    const { rerender } = render(
      <UserInfosProvider userInfosEndpoint="any-user-infos-endpoint-mock">
        <div>the children</div>
      </UserInfosProvider>,
    );
    rerender(
      <UserInfosProvider userInfosEndpoint="url-has-changed">
        <div>the children</div>
      </UserInfosProvider>,
    );
    // then
    expect(UserInfosService.fetchData).toHaveBeenCalledTimes(1);
    expect(UserInfosService.fetchData).toHaveBeenCalledWith(
      'any-user-infos-endpoint-mock',
      expect.any(Function),
    );
  });

  it('should call UserInfosService.fetchData only once at first render with an useCallback as parameter', () => {
    // given
    const setStateMock = jest.fn();
    const useCallbackMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockImplementation(() => useCallbackMock);
    jest.spyOn(React, 'useState').mockImplementation(() => [expect.any(Object), setStateMock]);

    // when
    const theProvider = (
      <UserInfosProvider userInfosEndpoint="any-user-infos-endpoint-mock">
        <div>the children</div>
      </UserInfosProvider>
    );
    const { rerender } = render(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    rerender(theProvider);
    // then
    expect(UserInfosService.fetchData).toHaveBeenCalledTimes(1);
    expect(UserInfosService.fetchData).toHaveBeenCalledWith(
      'any-user-infos-endpoint-mock',
      useCallbackMock,
    );
  });
});
