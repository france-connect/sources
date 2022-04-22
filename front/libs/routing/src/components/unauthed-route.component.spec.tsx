import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { UserInfosContext } from '@fc/oidc-client';
import { renderWithRouter } from '@fc/tests-utils';

import { UnauthedRouteComponent } from './unauthed-route.component';

describe('UnauthedRouteComponent', () => {
  // given
  const useContextMock = jest.spyOn(React, 'useContext');
  const LoaderMock = jest.fn(() => <div>mock-loader</div>);
  const ChildrenComponentMock = jest.fn(() => <div>children-component-mock</div>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call React.useContext with UserInfosContext as parameter', () => {
    // when
    renderWithRouter(
      <UnauthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-unauthed-route' },
    );
    // then
    expect(useContextMock).toHaveBeenCalledTimes(1);
    expect(useContextMock).toHaveBeenCalledWith(UserInfosContext);
  });

  it('should call a ReactRouter Route', () => {
    // when
    renderWithRouter(
      <UnauthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-unauthed-route' },
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
      <UnauthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-unauthed-route' },
    );
    const element = getByTestId('route-unauthed-component-loader-div');
    // then
    expect(ChildrenComponentMock).not.toHaveBeenCalled();
    expect(element).toBeInTheDocument();
  });

  it('should render the loader if defined and not ready', () => {
    // given
    useContextMock.mockReturnValueOnce({ connected: false, ready: false });
    // when
    const { getByText } = renderWithRouter(
      <UnauthedRouteComponent
        authRedirect="any-redirect-path"
        component={ChildrenComponentMock}
        loader={LoaderMock}
      />,
      { route: '/any-unauthed-route' },
    );
    const element = getByText('mock-loader');
    // then
    expect(ChildrenComponentMock).not.toHaveBeenCalled();
    expect(LoaderMock).toHaveBeenCalledTimes(1);
    expect(element).toBeInTheDocument();
  });

  it('should render the component when not connected and ready', () => {
    // given
    useContextMock.mockReturnValueOnce({ connected: false, ready: true });
    // when
    const { getByText } = renderWithRouter(
      <UnauthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-unauthed-route' },
    );
    const element = getByText('children-component-mock');
    // then
    expect(ChildrenComponentMock).toHaveBeenCalledTimes(1);
    expect(element).toBeInTheDocument();
  });

  it('should redirect if ready and connected', () => {
    // given
    useContextMock.mockReturnValueOnce({ connected: true, ready: true });
    // when
    renderWithRouter(
      <UnauthedRouteComponent authRedirect="any-redirect-path" component={ChildrenComponentMock} />,
      { route: '/any-unauthed-route' },
    );
    // then
    expect(Redirect).toHaveBeenCalledTimes(1);
    expect(Redirect).toHaveBeenCalledWith(
      { to: expect.objectContaining({ pathname: 'any-redirect-path' }) },
      {},
    );
  });
});
