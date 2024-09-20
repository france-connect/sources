import { fireEvent, render } from '@testing-library/react';

import { useSafeContext } from '@fc/common';

import { LayoutContext } from '../../../context';
import { LayoutHeaderMobileBurgerButton } from './layout-header.burger';

describe('LayoutHeaderMobileBurgerButton', () => {
  beforeEach(() => {
    // given
    jest.mocked(useSafeContext).mockReturnValue({
      menuIsOpened: true,
      toggleMenu: jest.fn(),
    });
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutHeaderMobileBurgerButton />);

    // then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-header__navbar');
  });

  it('should call useSafeContext', () => {
    // when
    render(<LayoutHeaderMobileBurgerButton />);

    // then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(LayoutContext);
  });

  it('should call toggleMenu callback when user click the button', () => {
    // given
    const toggleMenuMock = jest.fn();
    jest.mocked(useSafeContext).mockReturnValueOnce({
      menuIsOpened: true,
      toggleMenu: toggleMenuMock,
    });

    // when
    const { getByRole } = render(<LayoutHeaderMobileBurgerButton />);
    const element = getByRole('button');
    fireEvent.click(element);

    // then
    expect(toggleMenuMock).toHaveBeenCalledOnce();
  });

  it('should render the button to open the menu', () => {
    // given
    const toggleMenuMock = jest.fn();
    jest.mocked(useSafeContext).mockReturnValueOnce({
      menuIsOpened: 'any boolean mock',
      toggleMenu: toggleMenuMock,
    });

    // when
    const { getByTestId } = render(<LayoutHeaderMobileBurgerButton />);
    const element = getByTestId('burger-button-mobile-menu');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-controls', 'layout-header-menu-modal');
    expect(element).toHaveAttribute('aria-controls', 'layout-header-menu-modal');
    expect(element).toHaveAttribute('aria-haspopup', 'menu');
    expect(element).toHaveAttribute('data-fr-opened', 'any boolean mock');
    expect(element).toHaveAttribute('id', 'burger-button-mobile-menu');
  });
});
