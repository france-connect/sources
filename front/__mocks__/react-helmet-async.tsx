export const Helmet = jest.fn(() => (
  <div data-mockid="Helmet">
    <div>React Helmet Async</div>
  </div>
));

export const HelmetProvider = jest.fn(({ children }) => (
  <div data-mockid="HelmetProvider">
    <div>{children}</div>
  </div>
));
