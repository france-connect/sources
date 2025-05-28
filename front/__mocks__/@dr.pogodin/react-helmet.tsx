export const Helmet = jest.fn(({ children }) => {
  const childs = Array.isArray(children) ? children : [children];
  return (
    <div data-mockid="Helmet">
      {childs.map((item, index) => {
        const key = `HelmetMock-${item.type}-${index}`;
        return (
          <span key={key} data-htmltag={item.type}>
            {item.props.children}
          </span>
        );
      })}
    </div>
  );
});

export const HelmetProvider = jest.fn(({ children }) => (
  <div data-mockid="HelmetProvider">
    <div>{children}</div>
  </div>
));
