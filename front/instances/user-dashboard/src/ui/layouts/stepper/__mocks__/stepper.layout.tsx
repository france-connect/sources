import type { PropsWithChildren } from 'react';

export const StepperLayout = jest.fn(({ children }: Required<PropsWithChildren>) => (
  <div data-mockid="StepperLayout">{children}</div>
));
