const actualModule = jest.requireActual('react-router-dom');

module.exports = {
  ...actualModule,
  Link: jest.fn(({ children }) => <span>{children}</span>),
  NavLink: jest.fn(({ children }) => <div>{children}</div>),
  Navigate: jest.fn(() => <div>ReactRouterDom Navigate Component</div>),
  Outlet: jest.fn(() => <div>ReactRouterDom Outlet Component</div>),
  Route: jest.fn(({ children, element }) => {
    if (element) {
      return element;
    }
    return <div>{children}</div>;
  }),
  Routes: jest.fn(({ children }) => children),
  matchPath: jest.fn(),
  useLocation: jest.fn(() => ({
    pathname: '',
  })),
  useNavigate: jest.fn(() => jest.fn()),
  useParams: jest.fn(),
};

export {};
