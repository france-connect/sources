import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { AccountContext } from '@fc/account';
import { AxiosErrorCatcherContext } from '@fc/axios-error-catcher';
import { renderWithRouter } from '@fc/tests-utils';

import { AuthedRouteComponent } from './authed-route.component';

describe('AuthedRouteComponent', () => {
  // given
  const useContextMock = jest.spyOn(React, 'useContext');
  const LoaderMock = jest.fn(() => <div>mock-loader</div>);
  const ChildrenComponentMock = jest.fn(() => <div>children-component-mock</div>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call React.useContext with AccountContext and AxiosErrorCatcherContext as parameter', () => {
    // when
    renderWithRouter(
      <AuthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-authed-route' },
    );
    // then
    expect(useContextMock).toHaveBeenCalledTimes(2);
    expect(useContextMock).toHaveBeenCalledWith(AccountContext);
    expect(useContextMock).toHaveBeenCalledWith(AxiosErrorCatcherContext);
  });

  it('should call a ReactRouter Route', () => {
    // when
    renderWithRouter(
      <AuthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-authed-route' },
    );
    // then
    expect(Route).toHaveBeenCalledTimes(1);
    expect(Route).toHaveBeenCalledWith({ render: expect.any(Function) }, {});
  });

  it('should render emtpy element if not ready and loader is not defined', () => {
    // given
    useContextMock.mockReturnValueOnce({ connected: false, ready: false });
    // when
    const { getByTestId } = renderWithRouter(
      <AuthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-authed-route' },
    );
    const element = getByTestId('route-authed-component-loader-div');
    // then
    expect(ChildrenComponentMock).not.toHaveBeenCalled();
    expect(element).toBeInTheDocument();
  });

  it('should render the loader if defined and not ready', () => {
    // given
    useContextMock.mockReturnValueOnce({ connected: false, ready: false });
    // when
    const { getByText } = renderWithRouter(
      <AuthedRouteComponent
        authRedirect="any-redirect-path"
        component={ChildrenComponentMock}
        loader={LoaderMock}
      />,
      { route: '/any-authed-route' },
    );
    const element = getByText('mock-loader');
    // then
    expect(ChildrenComponentMock).not.toHaveBeenCalled();
    expect(LoaderMock).toHaveBeenCalledTimes(1);
    expect(element).toBeInTheDocument();
  });

  it('should render the component when connected and ready', () => {
    // given
    useContextMock.mockReturnValueOnce({ connected: true, ready: true });
    // when
    const { getByText } = renderWithRouter(
      <AuthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-authed-route' },
    );
    const element = getByText('children-component-mock');
    // then
    expect(ChildrenComponentMock).toHaveBeenCalledTimes(1);
    expect(element).toBeInTheDocument();
  });

  it('should redirect if ready and not connected', () => {
    // given
    useContextMock.mockReturnValueOnce({ connected: false, ready: true });
    // when
    renderWithRouter(
      <AuthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-authed-route' },
    );
    // then
    expect(Redirect).toHaveBeenCalledTimes(1);
    expect(Redirect).toHaveBeenCalledWith(
      { to: expect.objectContaining({ pathname: 'any-redirect-path' }) },
      {},
    );
  });

  it('should reset account data if 401 error', () => {
    // given
    const updateAccountMock = jest.fn();
    useContextMock.mockReturnValueOnce({
      connected: true,
      ready: true,
      updateAccount: updateAccountMock,
    });
    useContextMock.mockReturnValueOnce({ codeError: 401, hasError: true });
    // when
    renderWithRouter(
      <AuthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-authed-route' },
    );
    // then
    expect(updateAccountMock).toHaveBeenCalledTimes(1);
    expect(updateAccountMock).toHaveBeenCalledWith({
      connected: false,
      ready: true,
      userinfos: {
        firstname: '',
        lastname: '',
      },
    });
  });
});
