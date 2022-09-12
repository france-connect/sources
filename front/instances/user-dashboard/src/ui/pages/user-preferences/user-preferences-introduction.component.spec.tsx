import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useMediaQuery } from 'react-responsive';

import { UserPreferencesIntroductionComponent } from './user-preferences-introduction.component';

jest.mock('react-responsive');

describe('UserPreferencesIntroductionComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot on mobile', () => {
    // Given
    mocked(useMediaQuery).mockReturnValueOnce(false).mockReturnValueOnce(false);

    // When
    const { container } = render(<UserPreferencesIntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot on tablet', () => {
    // Given
    mocked(useMediaQuery).mockReturnValueOnce(true).mockReturnValueOnce(false);

    // When
    const { container } = render(<UserPreferencesIntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot on desktop', () => {
    // Given
    mocked(useMediaQuery).mockReturnValueOnce(true).mockReturnValueOnce(true);

    // When
    const { container } = render(<UserPreferencesIntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
