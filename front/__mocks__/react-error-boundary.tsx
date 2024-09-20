export const ErrorBoundary = jest.fn(({ children }) => (
  <div data-mockid={'ErrorBoundary'}>{children}</div>
));
