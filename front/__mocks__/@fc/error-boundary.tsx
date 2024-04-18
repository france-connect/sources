export const ErrorBoundaryComponent = jest.fn(({ children }) => (
  <div data-mockid={'ErrorBoundaryComponent'}>
    <div>ErrorBoundaryComponent</div>
    <div>{children}</div>
  </div>
));
