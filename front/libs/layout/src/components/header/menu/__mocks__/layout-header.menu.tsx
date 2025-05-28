import type { MouseEventHandler } from 'react';

export const LayoutHeaderMenuComponent = jest.fn(
  ({ onClose }: { onClose: MouseEventHandler<HTMLButtonElement> }) => (
    <div>
      <div>LayoutHeaderMenuComponent</div>
      {/* @NOTE Mocks file */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button data-testid="LayoutHeaderMenuComponent-button-mock" onClick={onClose} />
    </div>
  ),
);
