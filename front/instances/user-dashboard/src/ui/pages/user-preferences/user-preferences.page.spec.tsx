import { render } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import { StylesProvider, useStylesQuery, useStylesVariables } from '@fc/styles';
import { UserPreferencesComponent } from '@fc/user-preferences';

import { AppConfig } from '../../../config';
import { UserPreferencesIntroductionComponent } from '../../components';
import { UserPreferencesPage } from './user-preferences.page';

jest.mock('@fc/styles');
jest.mock('@fc/user-preferences');
jest.mock('../../components/user-preferences-introduction/user-preferences-introduction.component');

describe('UserPreferencesPage', () => {
  // given
  const cssVariablesMock = new CSSStyleDeclaration();
  cssVariablesMock.setProperty('--breakpoint-lg', 'any-pixel-value');

  const getComputedStyleMock = jest.spyOn(window, 'getComputedStyle');
  jest.mocked(getComputedStyleMock).mockReturnValue(cssVariablesMock);

  const Wrapper = ({ children }: PropsWithChildren) => <StylesProvider>{children}</StylesProvider>;

  beforeEach(() => {
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValueOnce(['any-pixel-value']);
  });

  it('should match the snapshot, display into a desktop viewport', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(<UserPreferencesPage />, { wrapper: Wrapper });

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // when
    const { container } = render(<UserPreferencesPage />, { wrapper: Wrapper });

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call useStylesVariables with breakpoints [breakpoint-lg]', () => {
    // when
    render(<UserPreferencesPage />, { wrapper: Wrapper });

    // then
    expect(useStylesVariables).toHaveBeenNthCalledWith(1, ['breakpoint-lg']);
  });

  it('should call useStylesQuery with breakpoints [breakpoint-lg]', () => {
    // when
    render(<UserPreferencesPage />, { wrapper: Wrapper });

    // then
    expect(useStylesQuery).toHaveBeenNthCalledWith(1, { minWidth: 'any-pixel-value' });
  });

  it('should call UserPreferencesIntroductionComponent without props', () => {
    // when
    render(<UserPreferencesPage />, { wrapper: Wrapper });

    // then
    expect(UserPreferencesIntroductionComponent).toHaveBeenCalled();
  });

  it('should call UserPreferencesComponent with props', () => {
    // when
    render(<UserPreferencesPage />, { wrapper: Wrapper });

    // then
    expect(UserPreferencesComponent).toHaveBeenCalledOnce();
    expect(UserPreferencesComponent).toHaveBeenCalledWith(
      { options: AppConfig.UserPreferences },
      {},
    );
  });
});
