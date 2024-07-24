export const Helmet = jest.fn(({ children }) => {
  return <div data-mockid="Helmet">{children}</div>;
});

export const HelmetProvider = jest.fn(({ children }) => (
  <div data-mockid="HelmetProvider">
    <div>{children}</div>
  </div>
));
