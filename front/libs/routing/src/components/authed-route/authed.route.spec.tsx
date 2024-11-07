import { render } from '@testing-library/react';
import type { Location } from 'react-router-dom';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AccountContext } from '@fc/account';
import { AxiosErrorCatcherContext } from '@fc/axios-error-catcher';
import { useSafeContext } from '@fc/common';

import { AuthedRoute } from './authed.route';

describe('AuthedRoute', () => {
  beforeEach(() => {
    // given
    jest.mocked(useLocation).mockReturnValue(expect.any(Object));
    jest
      .mocked(useSafeContext)
      .mockReturnValue({ codeError: undefined, connected: false, hasError: false, ready: true });
  });

  it('should retrieve url location parameters', () => {
    // when
    render(<AuthedRoute />);

    // then
    expect(useLocation).toHaveBeenCalledOnce();
  });

  it('should retrieve user connection information', () => {
    // when
    render(<AuthedRoute />);

    // then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should retrieve api call errors', () => {
    // when
    render(<AuthedRoute fallback="/any-authed-path" />);

    // then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AxiosErrorCatcherContext);
  });

  it('should render loader element if connection is not ready', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({ ready: false });

    // when
    const { getByTestId } = render(<AuthedRoute fallback="/any-authed-fallback" />);
    const element = getByTestId('route-authed-component-loader-div');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should redirect with parameters if the user is not connected', () => {
    // given
    const fallbackMock = jest.fn(() => `/any-authed-fallback`);
    const locationMock = {
      pathname: '/any-pathname',
      search: '?param=toto',
    } as unknown as Location;
    jest.mocked(useLocation).mockReturnValueOnce(locationMock);
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: false, ready: true });

    // when
    render(<AuthedRoute replace fallback={fallbackMock} />);

    // then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      {
        replace: true,
        state: { from: locationMock },
        to: '/any-authed-fallback',
      },
      {},
    );
    expect(fallbackMock).toHaveBeenCalledOnce();
    expect(fallbackMock).toHaveBeenCalledWith(locationMock);
  });

  it('should show correct page if user is connected', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: true, ready: true });

    // when
    render(<AuthedRoute fallback="/any-authed-fallback" />);

    // then
    expect(Outlet).toHaveBeenCalledOnce();
  });

  it('should redirect with default fallback is user is not connected', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: false, ready: true });

    // when
    render(<AuthedRoute />);

    // then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      {
        replace: false,
        state: { from: expect.any(Object) },
        to: '/login',
      },
      {},
    );
  });
});
