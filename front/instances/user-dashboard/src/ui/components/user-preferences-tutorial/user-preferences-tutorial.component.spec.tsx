import { render } from '@testing-library/react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { UserPreferencesTutorialComponent } from './user-preferences-tutorial.component';

jest.mock('@fc/styles');

describe('UserPreferencesTutorialComponent', () => {
  beforeEach(() => {
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(Number), expect.any(Number)]);
  });

  it('should match snapshot', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true).mockReturnValueOnce(true);

    // When
    const { container } = render(
      <UserPreferencesTutorialComponent
        alt="any-alt-mock-string"
        img="any-img-mock-string"
        label="any-label-mock-string"
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should have classes when lower than desktop', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(false);

    // When
    const { getByTestId } = render(
      <UserPreferencesTutorialComponent
        alt="any-alt-mock-string"
        img="any-img-mock-string"
        label="any-label-mock-string"
      />,
    );
    const container = getByTestId('user-preferences-tutorial-container');

    // Then
    expect(container).not.toHaveClass('tutorialSmallWidth');
    expect(container).toHaveClass('tutorialFullWidth');
  });

  it('should have classes when greater than or equal desktop', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true).mockReturnValueOnce(true);

    // When
    const { getByTestId } = render(
      <UserPreferencesTutorialComponent
        alt="any-alt-mock-string"
        img="any-img-mock-string"
        label="any-label-mock-string"
      />,
    );
    const container = getByTestId('user-preferences-tutorial-container');

    // Then
    expect(container).toHaveClass('tutorialSmallWidth');
    expect(container).not.toHaveClass('tutorialFullWidth');
  });

  it('should have classes when lower than tablet', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(false);

    // When
    const { getByTestId } = render(
      <UserPreferencesTutorialComponent
        alt="any-alt-mock-string"
        img="any-img-mock-string"
        label="any-label-mock-string"
      />,
    );
    const container = getByTestId('user-preferences-tutorial-img');

    // Then
    expect(container).not.toHaveClass('tutorialSmallWidth');
    expect(container).toHaveClass('tutorialFullWidth');
  });

  it('should have classes when greater than or equal tablet', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(false);

    // When
    const { getByTestId } = render(
      <UserPreferencesTutorialComponent
        alt="any-alt-mock-string"
        img="any-img-mock-string"
        label="any-label-mock-string"
      />,
    );
    const container = getByTestId('user-preferences-tutorial-img');

    // Then
    expect(container).not.toHaveClass('tutorialSmallWidth');
    expect(container).toHaveClass('tutorialFullWidth');
  });

  it('should add the className props to container', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(false);

    // When
    const { getByTestId } = render(
      <UserPreferencesTutorialComponent
        alt="any-alt-mock-string"
        className="any-mock-classname-from-props"
        img="any-img-mock-string"
        label="any-label-mock-string"
      />,
    );
    const container = getByTestId('user-preferences-tutorial-container');

    // Then
    expect(container).toHaveClass('any-mock-classname-from-props');
  });

  it('should call useStylesVariables with params', () => {
    // When
    render(
      <UserPreferencesTutorialComponent
        alt="any-alt-mock-string"
        img="any-img-mock-string"
        label="any-label-mock-string"
      />,
    );

    // Then
    expect(useStylesVariables).toHaveBeenCalledWith(['breakpoint-md', 'breakpoint-lg']);
  });
});
