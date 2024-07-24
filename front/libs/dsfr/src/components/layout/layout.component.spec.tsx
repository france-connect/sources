import { render } from '@testing-library/react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';
import { ApplicationLayout } from './layout.component';

// given
jest.mock('react-router-dom');
jest.mock('react-helmet-async');
jest.mock('./footer/layout-footer.component');
jest.mock('./header/layout-header.component');

describe('ApplicationLayout', () => {
  // given
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    // @NOTE by implementation JEST.DOM render component into a <div />
    // <html element cannot be a child of a <div /> element
    // we cannot use JEST.DOM.render(..., { container }) option, because
    // there's no parent container for a html element
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    // @NOTE by implementation JEST.DOM render component into a <div />
    // <html element cannot be a child of a <div /> element
    // we cannot use JEST.DOM.render(..., { container }) option, because
    // there's no parent container for a html element
    consoleErrorMock.mockRestore();
  });

  it('should match snapshot', () => {
    // when
    const { container } = render(<ApplicationLayout />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call Helmet component with children', () => {
    // when
    render(<ApplicationLayout />);

    // then
    expect(Helmet).toHaveBeenCalledOnce();
    expect(Helmet).toHaveBeenCalledWith(
      {
        children: expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          props: { 'data-fr-theme': 'light', lang: 'fr' },
          type: 'html',
        }),
      },
      {},
    );
  });

  it('should render LayoutHeaderComponent without props', () => {
    // when
    render(<ApplicationLayout />);

    // then
    expect(LayoutHeaderComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, {});
  });

  it('should render LayoutFooterComponent without props', () => {
    // when
    render(<ApplicationLayout />);

    // then
    expect(LayoutFooterComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, {});
  });

  it('should render Outlet without props', () => {
    // when
    render(<ApplicationLayout />);

    // then
    expect(Outlet).toHaveBeenCalledOnce();
    expect(Outlet).toHaveBeenCalledWith({}, {});
  });
});
