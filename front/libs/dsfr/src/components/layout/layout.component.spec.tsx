import { Helmet } from 'react-helmet';

import { renderWithRouter } from '@fc/tests-utils';

import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';
import * as LayoutComponent from './layout.component';

// given
jest.mock('react-helmet');
jest.mock('./footer/layout-footer.component');
jest.mock('./header/layout-header.component');
/*
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
*/
describe('ApplicationLayout', () => {
  it('should match snapshot', () => {
    // when
    const { container } = renderWithRouter(<LayoutComponent.ApplicationLayout />);

    // then
    expect(container).toMatchSnapshot();
  });

  // @NOTE skipped: unable to tests children property
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should call react helmet with children', () => {
    // when
    renderWithRouter(<LayoutComponent.ApplicationLayout />);

    // then
    expect(Helmet).toHaveBeenCalledTimes(1);
    expect(Helmet).toHaveBeenCalledWith(
      {
        // @NOTE only for tests purpose
        // eslint-disable-next-line react/jsx-key
        children: <html data-fr-theme="light" lang="fr" />,
      },
      {},
    );
  });

  it('should render LayoutHeaderComponent without props', () => {
    // when
    renderWithRouter(<LayoutComponent.ApplicationLayout />);

    // then
    expect(LayoutHeaderComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, {});
  });

  it('should render LayoutFooterComponent without props', () => {
    // when
    renderWithRouter(<LayoutComponent.ApplicationLayout />);

    // then
    expect(LayoutFooterComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, {});
  });
});
