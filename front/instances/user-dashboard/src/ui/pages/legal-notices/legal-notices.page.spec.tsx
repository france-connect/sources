import { render } from '@testing-library/react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { LegalNoticesPage } from './legal-notices.page';

describe('LegalNoticesPage', () => {
  // Given
  const cssVariablesMock = new CSSStyleDeclaration();
  cssVariablesMock.setProperty('--breakpoint-lg', 'any-pixel-value');

  const getComputedStyleMock = jest.spyOn(window, 'getComputedStyle');
  jest.mocked(getComputedStyleMock).mockReturnValue(cssVariablesMock);

  beforeEach(() => {
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValueOnce(['any-pixel-value']);
  });

  it('should match the snapshot, display into a desktop viewport', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // When
    const { container } = render(<LegalNoticesPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // When
    const { container } = render(<LegalNoticesPage />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
