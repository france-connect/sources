import { render } from '@testing-library/react';
import type { Location } from 'react-router-dom';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';

import { UnauthedRoute } from './unauthed.route';

describe('UnauthedRoute', () => {
  beforeEach(() => {
    // given
    jest.mocked(useLocation).mockReturnValue(expect.any(Object));
    jest.mocked(useSafeContext).mockReturnValue({ connected: true, ready: true });
  });

  it('should retrieve url location parameters', () => {
    // when
    render(<UnauthedRoute fallback="/any-authed-fallback" />);

    // then
    expect(useLocation).toHaveBeenCalledOnce();
  });

  it('should retrieve user connection information', () => {
    // when
    render(<UnauthedRoute fallback="/any-authed-fallback" />);

    // then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should render loader element if connection is not ready', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: false, ready: false });

    // when
    const { getByTestId } = render(<UnauthedRoute fallback="/any-authed-fallback" />);
    const element = getByTestId('route-unauthed-component-loader-div');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should redirect with parameters if the user is connected', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: true, ready: true });

    // when
    render(<UnauthedRoute fallback="/any-authed-fallback" />);

    // then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      { replace: false, state: { from: expect.any(Object) }, to: '/any-authed-fallback' },
      {},
    );
  });

  it('should show correct page if user is not connected', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: false, ready: true });

    // when
    render(<UnauthedRoute fallback="/any-authed-fallback" />);

    // then
    expect(Outlet).toHaveBeenCalledOnce();
  });

  it('should redirect with default fallback is user is connected', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: true, ready: true });

    // when
    render(<UnauthedRoute />);

    // then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      { replace: false, state: { from: expect.any(Object) }, to: '/' },
      {},
    );
  });

  it('should redirect with parameters is the user is connected', () => {
    // given
    const fallbackMock = jest.fn(() => '/any-authed-fallback');
    const locationMock = { pathname: '/any-pathname' } as unknown as Location;
    jest.mocked(useLocation).mockReturnValueOnce(locationMock);
    jest.mocked(useSafeContext).mockReturnValueOnce({ connected: true, ready: true });

    // when
    render(<UnauthedRoute fallback={fallbackMock} />);

    // then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      { replace: false, state: { from: locationMock }, to: '/any-authed-fallback' },
      {},
    );
    expect(fallbackMock).toHaveBeenCalledOnce();
    expect(fallbackMock).toHaveBeenCalledWith(locationMock);
  });
});
