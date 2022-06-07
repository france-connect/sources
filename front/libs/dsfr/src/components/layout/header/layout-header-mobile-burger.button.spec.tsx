import { fireEvent, render } from '@testing-library/react';

import { LayoutHeaderMobileBurgerButton } from './layout-header-mobile-burger.button';

describe('LayoutHeaderMobileBurgerButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot, when opened', () => {
    // given
    const onOpenMock = jest.fn();
    // when
    const { container } = render(<LayoutHeaderMobileBurgerButton opened onOpen={onOpenMock} />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when not opened', () => {
    // given
    const onOpenMock = jest.fn();
    // when
    const { container } = render(
      <LayoutHeaderMobileBurgerButton opened={false} onOpen={onOpenMock} />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should call onOpen callback when user click the button', () => {
    // given
    const onOpenMock = jest.fn();
    // when
    const { getByRole } = render(
      <LayoutHeaderMobileBurgerButton opened={false} onOpen={onOpenMock} />,
    );
    const element = getByRole('button');
    fireEvent.click(element);
    // then
    expect(onOpenMock).toHaveBeenCalledTimes(1);
  });
});
