import { fireEvent, render } from '@testing-library/react';

import { useSafeContext } from '@fc/common';

import { LayoutContext } from '../../../context';
import { LayoutHeaderNavigationComponent } from '../navigation/layout-header.navigation';
import { LayoutHeaderToolsComponent } from '../tools/layout-header.tools';
import { LayoutHeaderMenuComponent } from './layout-header.menu';

jest.mock('../navigation/layout-header.navigation');
jest.mock('../tools/layout-header.tools');

describe('LayoutHeaderMenuComponent', () => {
  const toggleMenuMock = jest.fn();
  const navigationMock = [
    {
      href: 'any-href-mock-1',
      label: 'any-label-mock-1',
      title: 'any-title-mock-1',
    },
    {
      href: 'any-href-mock-2',
      label: 'any-label-mock-2',
      title: 'any-title-mock-2',
    },
    {
      href: 'any-href-mock-3',
      label: 'any-label-mock-3',
      title: 'any-title-mock-3',
    },
  ];

  beforeEach(() => {
    // Given
    jest.mocked(useSafeContext).mockReturnValue({
      menuIsOpened: true,
      toggleMenu: toggleMenuMock,
    });
  });

  it('should match the snapshot, with navigation defined', () => {
    // When
    const { container, getByRole } = render(
      <LayoutHeaderMenuComponent navigation={navigationMock} />,
    );
    const button = getByRole('button');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-header__menu fr-modal no-touch-action');
    expect(container.firstChild).toHaveClass('fr-modal--opened');
    expect(container.firstChild).toHaveAttribute('id', 'layout-header-menu-modal');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('fr-btn--close fr-btn');
    expect(button).toHaveAttribute('aria-controls', 'layout-header-menu-modal');
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledWith({}, undefined);
    expect(LayoutHeaderNavigationComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderNavigationComponent).toHaveBeenCalledWith(
      {
        navigation: navigationMock,
        onItemClick: toggleMenuMock,
      },
      undefined,
    );
  });

  it('should match the snapshot, whithout navigation defined', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({
      menuIsOpened: false,
      toggleMenu: toggleMenuMock,
    });

    // When
    const { container, getByRole } = render(<LayoutHeaderMenuComponent />);
    const button = getByRole('button');

    // Then
    expect(container).toMatchSnapshot();
    expect(button).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('fr-header__menu fr-modal no-touch-action');
    expect(container.firstChild).not.toHaveClass('fr-modal--opened');
    expect(container.firstChild).toHaveAttribute('id', 'layout-header-menu-modal');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('fr-btn--close fr-btn');
    expect(button).toHaveAttribute('aria-controls', 'layout-header-menu-modal');
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledWith({}, undefined);
    expect(LayoutHeaderNavigationComponent).not.toHaveBeenCalled();
  });

  it('should call useSafeContext with LayoutContext', () => {
    // When
    render(<LayoutHeaderMenuComponent />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(LayoutContext);
  });

  it('should call toggleMenu on button click', () => {
    // When
    const { getByRole } = render(<LayoutHeaderMenuComponent />);
    const button = getByRole('button');
    fireEvent.click(button);

    // Then
    expect(toggleMenuMock).toHaveBeenCalledOnce();
  });
});
