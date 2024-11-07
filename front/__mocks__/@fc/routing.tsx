export const AuthedRoute = jest.fn(() => <div>AuthedRoute</div>);

export const UnauthedRoute = jest.fn(() => <div>UnauthedRoute</div>);

export const redirectToUrl = jest.fn();

export const useNavigateTo = jest.fn();

export const AuthFallbackRoutes = {
  INDEX: '/',
  LOGIN: '/login',
};
