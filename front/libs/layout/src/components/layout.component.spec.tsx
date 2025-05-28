import { render } from '@testing-library/react';
import { Outlet, ScrollRestoration } from 'react-router';

import { useSafeContext } from '@fc/common';

import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';
import { ApplicationLayout } from './layout.component';

// Given
jest.mock('./footer/layout-footer.component');
jest.mock('./header/layout-header.component');

describe('ApplicationLayout', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useSafeContext).mockReturnValue(expect.any(Object));
    // @NOTE by implementation JEST.DOM render component into a <div />
    // <html element cannot be a child of a <div /> element
    // we cannot use JEST.DOM.render(..., { container }) option, because
    // there's no parent container for a html element
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<ApplicationLayout />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render ScrollRestoration', () => {
    // When
    render(<ApplicationLayout />);

    // Then
    expect(ScrollRestoration).toHaveBeenCalledOnce();
    expect(ScrollRestoration).toHaveBeenCalledWith({}, undefined);
  });

  it('should render LayoutHeaderComponent without props', () => {
    // When
    render(<ApplicationLayout />);

    // Then
    expect(LayoutHeaderComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, undefined);
  });

  it('should render LayoutFooterComponent without props', () => {
    // When
    render(<ApplicationLayout />);

    // Then
    expect(LayoutFooterComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderComponent).toHaveBeenCalledWith({}, undefined);
  });

  it('should render Outlet without props', () => {
    // When
    render(<ApplicationLayout />);

    // Then
    expect(Outlet).toHaveBeenCalledOnce();
    expect(Outlet).toHaveBeenCalledWith({}, undefined);
  });
});
