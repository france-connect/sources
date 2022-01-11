import { RouteItem } from '@fc/routing';
import { renderWithRouter } from '@fc/tests-utils';

import { NavigationComponent } from '../navigation/navigation.component';
import { LayoutBackofficeComponent } from './layout-backoffice.component';

jest.mock('../navigation/navigation.component');

describe('LayoutBackofficeComponent', () => {
  const routesMock: RouteItem[] = [
    {
      component: jest.fn(() => <div>homepage</div>),
      id: 'mock-id-homepage',
      order: 0,
      path: '/homepage',
    },
    {
      component: jest.fn(() => <div>anypage</div>),
      id: 'mock-id-anypage',
      order: 1,
      path: '/anypage',
    },
  ];

  it('should have render navigation component', () => {
    // given
    renderWithRouter(<LayoutBackofficeComponent routes={routesMock} />);
    // then
    expect(NavigationComponent).toHaveBeenCalled();
    expect(NavigationComponent).toHaveBeenCalledWith(
      expect.objectContaining({ routes: routesMock }),
      {},
    );
  });
});
