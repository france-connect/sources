import { render } from '@testing-library/react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { UserPreferencesIntroductionComponent } from './user-preferences-introduction.component';

jest.mock('@fc/styles');
jest.mock('../user-preferences-tutorial/user-preferences-tutorial.component');

describe('UserPreferencesIntroductionComponent', () => {
  beforeEach(() => {
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(Number), expect.any(Number)]);
  });

  it('should match snapshot on mobile', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(false);

    // When
    const { container } = render(<UserPreferencesIntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot on tablet', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true).mockReturnValueOnce(false);

    // When
    const { container } = render(<UserPreferencesIntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot on desktop', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true).mockReturnValueOnce(true);

    // When
    const { container } = render(<UserPreferencesIntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
