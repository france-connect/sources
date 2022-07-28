const actualModule = jest.requireActual('react-router-dom');

module.exports = {
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
  matchPath: jest.fn(),
  useHistory: jest.fn(() => ({
    push: jest.fn(),
  })),
  useLocation: jest.fn(() => ({
    pathname: '',
  })),
};

export {};
