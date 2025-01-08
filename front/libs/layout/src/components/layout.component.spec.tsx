import { render } from '@testing-library/react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { useSafeContext } from '@fc/common';

import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';
import { ApplicationLayout } from './layout.component';

// Given
jest.mock('./footer/layout-footer.component');
jest.mock('./header/layout-header.component');

describe('ApplicationLayout', () => {
  // Given
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    jest.mocked(useSafeContext).mockReturnValue(expect.any(Object));

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
    // When
    const { container } = render(<ApplicationLayout />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call Helmet component with children', () => {
    // When
    render(<ApplicationLayout />);

    // Then
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
    // When
    render(<ApplicationLayout />);

    // Then
    expect(LayoutHeaderComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, {});
  });

  it('should render LayoutFooterComponent without props', () => {
    // When
    render(<ApplicationLayout />);

    // Then
    expect(LayoutFooterComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, {});
  });

  it('should render Outlet without props', () => {
    // When
    render(<ApplicationLayout />);

    // Then
    expect(Outlet).toHaveBeenCalledOnce();
    expect(Outlet).toHaveBeenCalledWith({}, {});
  });
});
