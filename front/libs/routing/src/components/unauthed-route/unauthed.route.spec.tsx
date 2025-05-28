import { render } from '@testing-library/react';
import type { Location } from 'react-router';
import { Navigate, Outlet, useLocation } from 'react-router';

import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';

import { UnauthedRoute } from './unauthed.route';

describe('UnauthedRoute', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useLocation).mockReturnValue(expect.any(Object));
    jest.mocked(useSafeContext).mockReturnValue({ connected: true, ready: true });
  });

  it('should retrieve url location parameters', () => {
    // When
    render(<UnauthedRoute fallback="/any-authed-fallback" />);

    // Then
    expect(useLocation).toHaveBeenCalledOnce();
  });

  it('should retrieve user connection information', () => {
    // When
    render(<UnauthedRoute fallback="/any-authed-fallback" />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should redirect with parameters if the user is connected', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: true, ready: true });

    // When
    render(<UnauthedRoute fallback="/any-authed-fallback" />);

    // Then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      { replace: false, state: { from: expect.any(Object) }, to: '/any-authed-fallback' },
      undefined,
    );
  });

  it('should show correct page if user is not connected', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: false, ready: true });

    // When
    render(<UnauthedRoute fallback="/any-authed-fallback" />);

    // Then
    expect(Outlet).toHaveBeenCalledOnce();
  });

  it('should redirect with default fallback is user is connected', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: true, ready: true });

    // When
    render(<UnauthedRoute />);

    // Then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      { replace: false, state: { from: expect.any(Object) }, to: '/' },
      undefined,
    );
  });

  it('should redirect with parameters is the user is connected', () => {
    // Given
    const fallbackMock = jest.fn(() => '/any-authed-fallback');
    const locationMock = { pathname: '/any-pathname' } as unknown as Location;
    jest.mocked(useLocation).mockReturnValueOnce(locationMock);
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: true, ready: true });

    // When
    render(<UnauthedRoute fallback={fallbackMock} />);

    // Then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      { replace: false, state: { from: locationMock }, to: '/any-authed-fallback' },
      undefined,
    );
    expect(fallbackMock).toHaveBeenCalledOnce();
    expect(fallbackMock).toHaveBeenCalledWith(locationMock);
  });
});
