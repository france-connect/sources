// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const renderWithRouter = (
  children: JSX.Element,
  { route = '/' } = {},
) => {
  window.history.pushState({}, 'Test page', route);
  return render(children, { wrapper: MemoryRouter as any });
};
