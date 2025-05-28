import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

const RouterCustomWrapper = MemoryRouter;

export const renderWithRouter = (children: ReactNode, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(children, { wrapper: RouterCustomWrapper });
};
