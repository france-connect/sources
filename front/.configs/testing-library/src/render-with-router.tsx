/* istanbul ignore file */

// declarative file
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const RouterCustomWrapper = MemoryRouter;

export const renderWithRouter = (children: JSX.Element, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(children, { wrapper: RouterCustomWrapper });
};
