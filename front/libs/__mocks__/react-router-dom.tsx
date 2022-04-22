const actualModule = jest.requireActual('react-router-dom');

module.exports = {
  _esModule: true,
  ...actualModule,
  Link: jest.fn(({ children }) => <div>{children}</div>),
  NavLink: jest.fn(({ children }) => <div>{children}</div>),
  Redirect: jest.fn(() => <div>Redirect</div>),
  Route: jest.fn(({ children, render, ...rest }) => {
    if (render) {
      return render({ ...rest });
    }
    return <div>{children}</div>;
  }),
  Switch: jest.fn(({ children }) => children),
};

export {};
