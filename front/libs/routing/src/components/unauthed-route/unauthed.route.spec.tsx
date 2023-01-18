import { render } from '@testing-library/react';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AccountContext } from '@fc/account';

import { UnauthedRoute } from './unauthed.route';

jest.mock('react-router-dom');

describe('UnauthedRoute', () => {
  // given
  const outletMock = jest.mocked(Outlet);
  const navigateMock = jest.mocked(Navigate);
  const useLocationMock = jest.mocked(useLocation);
  const useContextMock = jest.spyOn(React, 'useContext');

  it('should call React.useContext with AccountContext as parameter', () => {
    // when
    render(<UnauthedRoute fallbackPath="/any-authed-path" />);

    // then
    expect(useContextMock).toHaveBeenCalledTimes(1);
    expect(useContextMock).toHaveBeenCalledWith(AccountContext);
  });

  it('should call useLocation react-router-dom hook', () => {
    // when
    render(<UnauthedRoute fallbackPath="/any-authed-path" />);

    // then
    expect(useLocationMock).toHaveBeenCalledTimes(1);
  });

  it('should render loader element if not ready', () => {
    // given
    useContextMock.mockReturnValueOnce({ connected: false, ready: false });

    // when
    const { getByTestId } = render(<UnauthedRoute fallbackPath="/any-authed-path" />);
    const element = getByTestId('route-unauthed-component-loader-div');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should call Navigate with parameters replace as true', () => {
    // given
    const locationMock = {
      hash: expect.any(String),
      key: expect.any(String),
      pathname: '/any-pathname',
      search: expect.any(String),
      state: expect.any(Object),
    };
    useLocationMock.mockReturnValueOnce(locationMock);
    useContextMock.mockReturnValueOnce({ connected: true, ready: true });

    // when
    render(<UnauthedRoute replace fallbackPath="/any-authed-path" />);

    // then
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(
      { replace: true, state: { from: '/any-pathname' }, to: '/any-authed-path' },
      {},
    );
  });

  it('should call Navigate with parameters if connected', () => {
    // given
    useContextMock.mockReturnValueOnce({ connected: true, ready: true });

    // when
    render(<UnauthedRoute fallbackPath="/any-authed-path" />);

    // then
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(
      { replace: false, state: { from: expect.any(String) }, to: '/any-authed-path' },
      {},
    );
  });

  it('should call Outlet from react-router-dom if user is not connected', () => {
    // given
    useContextMock.mockReturnValueOnce({ connected: false, ready: true });

    // when
    render(<UnauthedRoute fallbackPath="/any-authed-path" />);

    // then
    expect(outletMock).toHaveBeenCalledTimes(1);
  });
});
