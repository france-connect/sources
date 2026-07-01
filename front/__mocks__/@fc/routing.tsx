export const AuthedRoute = jest.fn(() => <div>AuthedRoute</div>);

export const UnauthedRoute = jest.fn(() => <div>UnauthedRoute</div>);

export const redirectToUrl = jest.fn();

export const useCleanupRouteState = jest.fn(() => ({
  cleanupRouteState: jest.fn(),
  state: undefined,
}));

export const useNavigateWithState = jest.fn(() => ({
  goBack: jest.fn(),
  goBackWithError: jest.fn(),
  goBackWithSuccess: jest.fn(),
  navigateWithState: jest.fn(),
}));

export const AuthFallbackRoutes = {
  INDEX: '/',
  LOGIN: '/login',
};

export const RoutePaths = {
  CURRENT: '.',
  PREVIOUS: '..',
};
