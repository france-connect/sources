import { render } from '@testing-library/react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';
import { TracksListComponent } from '@fc/tracks';

import { IntroductionComponent } from './introduction';
import { TracksPage } from './tracks.page';

jest.mock('./introduction');

describe('TracksPage', () => {
  const TracksListComponentMock = jest.mocked(TracksListComponent);
  TracksListComponentMock.mockReturnValue(<div>FooBar TracksListComponent</div>);

  beforeEach(() => {
    // Given
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(String)]);
  });

  it('should match the snapshot', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(true);

    // When
    const { container } = render(<TracksPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call IntroductionComponent', () => {
    // When
    render(<TracksPage />);

    // Then
    expect(IntroductionComponent).toHaveBeenCalled();
  });

  it('should called TracksListComponent', () => {
    // When
    render(<TracksPage />);

    // Then
    expect(TracksListComponent).toHaveBeenCalled();
  });
});
