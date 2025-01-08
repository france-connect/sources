import { render } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import { StylesProvider, useStylesQuery, useStylesVariables } from '@fc/styles';
import { UserPreferencesComponent } from '@fc/user-preferences';

import { UserPreferencesIntroductionComponent } from '../../components';
import { UserPreferencesPage } from './user-preferences.page';

jest.mock('../../components/user-preferences-introduction/user-preferences-introduction.component');

describe('UserPreferencesPage', () => {
  // Given
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
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // When
    const { container } = render(<UserPreferencesPage />, { wrapper: Wrapper });

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // When
    const { container } = render(<UserPreferencesPage />, { wrapper: Wrapper });

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useStylesVariables with breakpoints [breakpoint-lg]', () => {
    // When
    render(<UserPreferencesPage />, { wrapper: Wrapper });

    // Then
    expect(useStylesVariables).toHaveBeenNthCalledWith(1, ['breakpoint-lg']);
  });

  it('should call useStylesQuery with breakpoints [breakpoint-lg]', () => {
    // When
    render(<UserPreferencesPage />, { wrapper: Wrapper });

    // Then
    expect(useStylesQuery).toHaveBeenNthCalledWith(1, { minWidth: 'any-pixel-value' });
  });

  it('should call UserPreferencesIntroductionComponent without props', () => {
    // When
    render(<UserPreferencesPage />, { wrapper: Wrapper });

    // Then
    expect(UserPreferencesIntroductionComponent).toHaveBeenCalled();
  });

  it('should call UserPreferencesComponent with props', () => {
    // When
    render(<UserPreferencesPage />, { wrapper: Wrapper });

    // Then
    expect(UserPreferencesComponent).toHaveBeenCalledOnce();
    expect(UserPreferencesComponent).toHaveBeenCalledWith({}, {});
  });
});
