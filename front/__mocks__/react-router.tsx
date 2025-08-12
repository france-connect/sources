const actualModule = jest.requireActual('react-router');

module.exports = {
  ...actualModule,
  BrowserRouter: jest.fn(({ children, element }) => {
    if (element) {
      return element;
    }
    return <div data-mockid="BrowserRouter">{children}</div>;
  }),
  Link: jest.fn(({ children }) => <span data-mockid="Link">{children}</span>),
  NavLink: jest.fn(({ children }) => <div data-mockid="NavLink">{children}</div>),
  Navigate: jest.fn(() => <div>ReactRouterDom Navigate Component</div>),
  Outlet: jest.fn(() => <div>ReactRouterDom Outlet Component</div>),
  Route: jest.fn(({ children, element }) => {
    if (element) {
      return element;
    }
    return <div data-mockid="Route">{children}</div>;
  }),
  Routes: jest.fn(({ children }) => children),
  ScrollRestoration: jest.fn(() => <span data-mockid="ScrollRestoration" />),
  generatePath: jest.fn(),
  isRouteErrorResponse: jest.fn(),
  matchPath: jest.fn(),
  redirect: jest.fn(),
  resolvePath: jest.fn(),
  useLoaderData: jest.fn(),
  useLocation: jest.fn(() => ({
    pathname: '',
  })),
  useMatch: jest.fn(),
  useNavigate: jest.fn(() => jest.fn()),
  useOutletContext: jest.fn(),
  useParams: jest.fn(),
  useRouteError: jest.fn(),
  useRouteLoaderData: jest.fn(),
  useSearchParams: jest.fn(() => [new URLSearchParams(), jest.fn()]),
};

export {};
