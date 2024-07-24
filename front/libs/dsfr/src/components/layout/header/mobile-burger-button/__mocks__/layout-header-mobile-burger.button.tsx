import { MouseEventHandler } from 'react';

export const LayoutHeaderMobileBurgerButton = jest.fn(
  ({ onOpen }: { onOpen: MouseEventHandler<HTMLButtonElement> }) => (
    <div>
      <div>LayoutHeaderMobileBurgerButton</div>
      <button data-testid="LayoutHeaderMobileBurgerButton-button-mock" onClick={onOpen}></button>
    </div>
  ),
);
