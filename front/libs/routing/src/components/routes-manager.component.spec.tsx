import { render } from '@testing-library/react';
import { Route, Switch } from 'react-router-dom';

import { RoutesManagerComponent } from './routes-manager.component';

describe('RoutesManagerComponent', () => {
  // given
  const HomeComponentMock = () => <div />;
  const AuthRouteComponentMock = jest.fn(() => <div />);
  const routesMock = [
    {
      component: HomeComponentMock,
      path: '/',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call react-router switch', () => {
    // when
    render(<RoutesManagerComponent routes={routesMock} />);

    // then
    expect(Switch).toHaveBeenCalledTimes(1);
  });

  it('should render a react-router route', () => {
    // when
    render(<RoutesManagerComponent routes={routesMock} />);

    // then
    expect(Route).toHaveBeenCalledTimes(1);
    expect(Route).toHaveBeenCalledWith(
      expect.objectContaining({
        component: HomeComponentMock,
        path: '/',
      }),
      {},
    );
  });

  it('should render a auth route', () => {
    // when
    render(
      <RoutesManagerComponent
        routes={[
          {
            ...routesMock[0],
            path: '/authed',
            routing: { authRedirect: '/any-redirect-path', authWrapper: AuthRouteComponentMock },
          },
        ]}
      />,
    );

    // then
    expect(AuthRouteComponentMock).toHaveBeenCalledTimes(1);
    expect(AuthRouteComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        authRedirect: '/any-redirect-path',
        component: HomeComponentMock,
        path: '/authed',
      }),
      {},
    );
  });
});
