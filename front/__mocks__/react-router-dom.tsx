const actualModule = jest.requireActual('react-router-dom');

module.exports = {
  ...actualModule,
  Link: jest.fn(({ children }) => <span data-mockid={'Link'}>{children}</span>),
  NavLink: jest.fn(({ children }) => <div data-mockid={'NavLink'}>{children}</div>),
  Navigate: jest.fn(() => <div>ReactRouterDom Navigate Component</div>),
  Outlet: jest.fn(() => <div>ReactRouterDom Outlet Component</div>),
  Route: jest.fn(({ children, element }) => {
    if (element) {
      return element;
    }
    return <div data-mockid={'Route'}>{children}</div>;
  }),
  BrowserRouter: jest.fn(({ children, element }) => {
    if (element) {
      return element;
    }
    return <div data-mockid={'BrowserRouter'}>{children}</div>;
  }),
  Routes: jest.fn(({ children }) => children),
  ScrollRestoration: jest.fn(() => <span data-mockid={'ScrollRestoration'} />),
  matchPath: jest.fn(),
  useLocation: jest.fn(() => ({
    pathname: '',
  })),
  useNavigate: jest.fn(() => jest.fn()),
  useParams: jest.fn(),
  useSearchParams: jest.fn(() => [new URLSearchParams(), jest.fn()]),
  useLoaderData: jest.fn(),
  useRouteLoaderData: jest.fn(),
  useRouteError: jest.fn(),
  useOutletContext: jest.fn(),
  isRouteErrorResponse: jest.fn(),
  redirect: jest.fn(),
};

export {};
