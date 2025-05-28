import { render } from '@testing-library/react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { IdentityTheftReportPage } from './identity-theft-report.page';

describe('IdentityTheftReportPage', () => {
  // Given
  const cssVariablesMock = new CSSStyleDeclaration();
  cssVariablesMock.setProperty('--breakpoint-lg', 'any-pixel-value');

  const getComputedStyleMock = jest.spyOn(window, 'getComputedStyle');
  jest.mocked(getComputedStyleMock).mockReturnValue(cssVariablesMock);

  beforeEach(() => {
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValue(['any-pixel-value']);
  });

  it('should call the responsive hooks, useStylesVariables and useStylesQuery', () => {
    // When
    render(<IdentityTheftReportPage />);

    // Then
    expect(useStylesVariables).toHaveBeenNthCalledWith(1, ['breakpoint-lg']);
    expect(useStylesQuery).toHaveBeenNthCalledWith(1, { minWidth: 'any-pixel-value' });
  });

  it('should match the snapshot, display into a desktop viewport', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // When
    const { container } = render(<IdentityTheftReportPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // When
    const { container } = render(<IdentityTheftReportPage />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
