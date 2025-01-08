import { fireEvent, render } from '@testing-library/react';

import { useSafeContext } from '@fc/common';

import { LayoutContext } from '../../../context';
import { LayoutHeaderMobileBurgerButton } from './layout-header.burger';

describe('LayoutHeaderMobileBurgerButton', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useSafeContext).mockReturnValue({
      menuIsOpened: true,
      toggleMenu: jest.fn(),
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<LayoutHeaderMobileBurgerButton />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-header__navbar');
  });

  it('should call useSafeContext', () => {
    // When
    render(<LayoutHeaderMobileBurgerButton />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(LayoutContext);
  });

  it('should call toggleMenu callback when user click the button', () => {
    // Given
    const toggleMenuMock = jest.fn();
    jest.mocked(useSafeContext).mockReturnValueOnce({
      menuIsOpened: true,
      toggleMenu: toggleMenuMock,
    });

    // When
    const { getByRole } = render(<LayoutHeaderMobileBurgerButton />);
    const element = getByRole('button');
    fireEvent.click(element);

    // Then
    expect(toggleMenuMock).toHaveBeenCalledOnce();
  });

  it('should render the button to open the menu', () => {
    // Given
    const toggleMenuMock = jest.fn();
    jest.mocked(useSafeContext).mockReturnValueOnce({
      menuIsOpened: 'any boolean mock',
      toggleMenu: toggleMenuMock,
    });

    // When
    const { getByTestId } = render(<LayoutHeaderMobileBurgerButton />);
    const element = getByTestId('burger-button-mobile-menu');

    // Then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-controls', 'layout-header-menu-modal');
    expect(element).toHaveAttribute('aria-controls', 'layout-header-menu-modal');
    expect(element).toHaveAttribute('aria-haspopup', 'menu');
    expect(element).toHaveAttribute('data-fr-opened', 'any boolean mock');
    expect(element).toHaveAttribute('id', 'burger-button-mobile-menu');
  });
});
