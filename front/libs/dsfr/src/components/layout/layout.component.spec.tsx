import { Helmet } from 'react-helmet-async';

import { renderWithRouter } from '@fc/testing-library';

import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';
import * as LayoutComponent from './layout.component';

// given
jest.mock('react-helmet-async');
jest.mock('./footer/layout-footer.component');
jest.mock('./header/layout-header.component');

describe('ApplicationLayout', () => {
  it('should match snapshot', () => {
    // when
    const { container } = renderWithRouter(<LayoutComponent.ApplicationLayout />);

    // then
    expect(container).toMatchSnapshot();
  });

  // @TODO fix this test
  // @NOTE skipped: unable to tests children property
  it.skip('should call react-helmet-async with children', () => {
    // when
    renderWithRouter(<LayoutComponent.ApplicationLayout />);

    // then
    expect(Helmet).toHaveBeenCalledOnce();
    expect(Helmet).toHaveBeenCalledWith(
      {
        children: <html data-fr-theme="light" lang="fr" />,
      },
      {},
    );
  });

  it('should render LayoutHeaderComponent without props', () => {
    // when
    renderWithRouter(<LayoutComponent.ApplicationLayout />);

    // then
    expect(LayoutHeaderComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, {});
  });

  it('should render LayoutFooterComponent without props', () => {
    // when
    renderWithRouter(<LayoutComponent.ApplicationLayout />);

    // then
    expect(LayoutFooterComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, {});
  });
});
