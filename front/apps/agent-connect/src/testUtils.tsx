/* istanbul ignore file */

// tooling file

/* ******************************

  Units Tests Custom Render

  READ:
  --------------------------------------
  https://testing-library.com/docs/react-testing-library/setup/#custom-render

 - Wrapper du render de @testing-library/react
 - Wrapper du provider react-redux
 - Permet de d'injecter des valeurs de tests pour le store redux

*/
/* eslint
  import/no-extraneous-dependencies: 0
*/
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { initialState as defaultInitialState } from './redux/config';
import createRootReducer from './redux/reducers';

type WrapperProps = {
  children: JSX.Element;
};

const rootReducer = createRootReducer();

function renderWithRedux(
  ui: ReactElement,
  { initialState = {}, reducers = rootReducer, ...renderOptions } = {},
): RenderResult {
  const store = createStore(reducers, {
    ...defaultInitialState,
    ...initialState,
  });
  function Wrapper({ children }: WrapperProps): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions } as RenderOptions);
}

export * from '@testing-library/react';
export { renderWithRedux };
