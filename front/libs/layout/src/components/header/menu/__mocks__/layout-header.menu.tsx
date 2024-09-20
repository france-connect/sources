import { MouseEventHandler } from 'react';

export const LayoutHeaderMenuComponent = jest.fn(
  ({ onClose }: { onClose: MouseEventHandler<HTMLButtonElement> }) => (
    <div>
      <div>LayoutHeaderMenuComponent</div>
      <button data-testid="LayoutHeaderMenuComponent-button-mock" onClick={onClose}></button>
    </div>
  ),
);
