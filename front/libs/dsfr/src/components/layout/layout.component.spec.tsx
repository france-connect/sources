import { Location } from 'history';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { mocked } from 'ts-jest/utils';

import { RoutesManagerComponent } from '@fc/routing';
import { renderWithRouter } from '@fc/tests-utils';

import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';
import * as LayoutComponent from './layout.component';

// given
jest.mock('react-helmet');
jest.mock('./footer/layout-footer.component');
jest.mock('./header/layout-header.component');

const routes = [
  {
    component: () => <div>route-1</div>,
    id: 'route-1',
    label: 'route-1',
    order: 0,
    path: '/route-1',
  },
  {
    component: () => <div>route-2</div>,
    id: 'route-2',
    label: 'route-2',
    order: 1,
    path: '/route-2',
  },
];

describe('ApplicationLayout', () => {
  const config = {
    bottomLinks: [
      {
        a11y: 'mock-a11y',
        href: 'mock-href',
        label: 'mock-label',
      },
    ],
    footerDescription: 'mock-footerDescription',
    footerLinkTitle: 'mock-footerLinkTitle',
    logo: jest.fn(() => <div>mock-logo</div>),
    returnButton: jest.fn(() => <div>mock-returnButton</div>),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    // given
    const { container } = renderWithRouter(
      <LayoutComponent.ApplicationLayout config={config} routes={routes} />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should call useLocation', () => {
    // when
    renderWithRouter(<LayoutComponent.ApplicationLayout config={config} routes={routes} />);
    // then
    expect(useLocation).toHaveBeenCalledTimes(1);
  });

  it('should call getCurrentRouteObjectByPath', () => {
    // given
    const pathnameMock = 'any-location-mock';
    mocked(useLocation).mockReturnValueOnce({ pathname: pathnameMock } as unknown as Location);
    const getCurrentRouteObjectByPathMock = jest.spyOn(
      LayoutComponent,
      'getCurrentRouteObjectByPath',
    );
    // when
    renderWithRouter(<LayoutComponent.ApplicationLayout config={config} routes={routes} />);
    // then
    expect(getCurrentRouteObjectByPathMock).toHaveBeenCalledTimes(1);
    expect(getCurrentRouteObjectByPathMock).toHaveBeenCalledWith(routes, pathnameMock);
  });

  it('should call getDocumentTitle', () => {
    // given
    const routeObjMock = expect.any(Object);
    jest.spyOn(LayoutComponent, 'getCurrentRouteObjectByPath').mockReturnValueOnce(routeObjMock);
    const getDocumentTitleMock = jest.spyOn(LayoutComponent, 'getDocumentTitle');
    // when
    renderWithRouter(<LayoutComponent.ApplicationLayout config={config} routes={routes} />);
    // then
    expect(getDocumentTitleMock).toHaveBeenCalledTimes(1);
    expect(getDocumentTitleMock).toHaveBeenCalledWith(routeObjMock);
  });

  //  @NOTE Unable to pass this test :shrug:
  // eslint-disable-next-line
  it.skip('should call react helmet with children', () => {
    // given
    const getDocumentTitleMock = jest.spyOn(LayoutComponent, 'getDocumentTitle');
    getDocumentTitleMock.mockReturnValueOnce('mock-title-value');
    // when
    renderWithRouter(<LayoutComponent.ApplicationLayout config={config} routes={routes} />);
    // then
    expect(Helmet).toHaveBeenCalledTimes(1);
    expect(Helmet).toHaveBeenCalledWith(
      {
        // eslint-disable-next-line
        children: [<html data-fr-theme="light" lang="fr" />, <title>mock-title-value</title>],
        defer: true,
        encodeSpecialCharacters: true,
      },
      {},
    );
  });

  it('should render LayoutHeaderComponent without props', () => {
    // given
    renderWithRouter(<LayoutComponent.ApplicationLayout config={config} routes={routes} />);
    // then
    expect(LayoutHeaderComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, {});
  });

  it('should render RoutesManagerComponent with routes props', () => {
    // given
    renderWithRouter(<LayoutComponent.ApplicationLayout config={config} routes={routes} />);
    // then
    expect(RoutesManagerComponent).toHaveBeenCalledTimes(1);
    expect(RoutesManagerComponent).toHaveBeenCalledWith({ routes }, {});
  });

  it('should render LayoutFooterComponent without props', () => {
    // given
    renderWithRouter(<LayoutComponent.ApplicationLayout config={config} routes={routes} />);
    // then
    expect(LayoutFooterComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, {});
  });
});

describe('ApplicationLayout.getDocumentTitle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should output page title from current route', () => {
    // given
    const route = routes[0];
    const result = LayoutComponent.getDocumentTitle(route);
    // then
    expect(result).toStrictEqual(`${route.label} - `);
  });

  it('should output empty string if route object.label is falsy', () => {
    // given
    const route = { component: () => <div />, id: 'any', label: undefined, path: 'any' };
    const result = LayoutComponent.getDocumentTitle(route);
    // then
    expect(result).toStrictEqual('');
  });
});
