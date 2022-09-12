export const ErrorBoundaryComponent = jest.fn(({ children }) => (
  <div>
    <div>ErrorBoundaryComponent</div>
    <div>{children}</div>
  </div>
));
