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
 import/no-extraneous-dependencies: 0 */
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

type WrapperProps = {
  children: JSX.Element;
};

export const renderWithRedux = (
  defaultInitialState: any,
  createRootReducer: Function,
) => {
  const rootReducers = createRootReducer();
  const parsedState = defaultInitialState;

  return (
    ui: ReactElement,
    { mockstate = {}, ...renderOptions } = {},
  ): RenderResult => {
    const state = { ...parsedState, ...mockstate };
    const store = createStore(rootReducers, state);
    function Wrapper({ children }: WrapperProps): JSX.Element {
      return <Provider store={store}>{children}</Provider>;
    }
    return rtlRender(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    } as RenderOptions);
  };
};
