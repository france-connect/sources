import { RoutePath } from '@fc/routing';
import { FunctionComponent } from 'react';
import { renderWithRouter } from '@fc/common';
import { NavigationComponent } from './navigation.component';

const Div: FunctionComponent = () => <div />;

const mockRoutes = [
  {
    component: Div,
    id: 'homepage',
    label: 'home',
    order: 1,
    path: '/home' as RoutePath,
  },
  {
    component: Div,
    id: 'not-found',
    label: 'not-found',
    path: '/404' as RoutePath,
  },
  {
    component: Div,
    id: 'about',
    label: 'about',
    order: 2,
    path: '/about' as RoutePath,
  },
];

describe('NavigationComponent', () => {
  beforeEach(() => {});

  it('should render a list of items filtered on the order property', () => {
    // given
    const { getByText } = renderWithRouter(
      <NavigationComponent routes={mockRoutes} />,
    );
    // when
    const homeElement = getByText('home');
    const aboutElement = getByText('about');
    // then
    expect(homeElement).toBeInTheDocument();
    expect(aboutElement).toBeInTheDocument();
  });

  it('should not render an item which has not the order property', () => {
    // given
    const { getByText } = renderWithRouter(
      <NavigationComponent routes={mockRoutes} />,
    );
    // then
    expect(() => getByText('not-found')).toThrow();
  });
});
