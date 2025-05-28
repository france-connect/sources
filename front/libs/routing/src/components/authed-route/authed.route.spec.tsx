import { render } from '@testing-library/react';
import type { Location } from 'react-router';
import { Navigate, Outlet, useLocation } from 'react-router';

import { AccountContext } from '@fc/account';
import { AxiosErrorCatcherContext } from '@fc/axios-error-catcher';
import { useSafeContext } from '@fc/common';

import { AuthedRoute } from './authed.route';

describe('AuthedRoute', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useLocation).mockReturnValue(expect.any(Object));
    jest
      .mocked(useSafeContext)
      .mockReturnValue({ codeError: undefined, connected: false, hasError: false, ready: true });
  });

  it('should retrieve url location parameters', () => {
    // When
    render(<AuthedRoute />);

    // Then
    expect(useLocation).toHaveBeenCalledOnce();
  });

  it('should retrieve user connection information', () => {
    // When
    render(<AuthedRoute />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should retrieve api call errors', () => {
    // When
    render(<AuthedRoute fallback="/any-authed-path" />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AxiosErrorCatcherContext);
  });

  it('should redirect with parameters if the user is not connected', () => {
    // Given
    const fallbackMock = jest.fn(() => `/any-authed-fallback`);
    const locationMock = {
      pathname: '/any-pathname',
      search: '?param=toto',
    } as unknown as Location;
    jest.mocked(useLocation).mockReturnValueOnce(locationMock);
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: false, ready: true });

    // When
    render(<AuthedRoute replace fallback={fallbackMock} />);

    // Then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      {
        replace: true,
        state: { from: locationMock },
        to: '/any-authed-fallback',
      },
      undefined,
    );
    expect(fallbackMock).toHaveBeenCalledOnce();
    expect(fallbackMock).toHaveBeenCalledWith(locationMock);
  });

  it('should show correct page if user is connected', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: true, ready: true });

    // When
    render(<AuthedRoute fallback="/any-authed-fallback" />);

    // Then
    expect(Outlet).toHaveBeenCalledOnce();
  });

  it('should redirect with default fallback is user is not connected', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: false, ready: true });

    // When
    render(<AuthedRoute />);

    // Then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      {
        replace: false,
        state: { from: expect.any(Object) },
        to: '/login',
      },
      undefined,
    );
  });
});
