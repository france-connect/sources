import { PropsWithChildren } from 'react';

export const ErrorBoundaryComponent = jest.fn(({ children }: PropsWithChildren) => (
  <div data-mockid={'ErrorBoundaryComponent'}>
    <div>ErrorBoundaryComponent</div>
    <div>{children}</div>
  </div>
));
