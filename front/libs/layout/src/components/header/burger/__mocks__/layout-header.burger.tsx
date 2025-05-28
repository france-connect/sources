import type { MouseEventHandler } from 'react';

export const LayoutHeaderMobileBurgerButton = jest.fn(
  ({ onOpen }: { onOpen: MouseEventHandler<HTMLButtonElement> }) => (
    // @NOTE Mocks file
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button data-testid="LayoutHeaderMobileBurgerButton-button-mock" onClick={onOpen} />
  ),
);
