import { render } from '@testing-library/react';

import { TracksListComponent } from '@fc/tracks';

import { IntroductionComponent } from './introduction';
import { TracksPage } from './tracks.page';

jest.mock('@fc/tracks');
jest.mock('./introduction');

describe('TracksPage', () => {
  const TracksListComponentMock = jest.mocked(TracksListComponent);
  TracksListComponentMock.mockReturnValue(<div>FooBar TracksListComponent</div>);

  it('should match the snapshot', () => {
    // when
    const { container } = render(<TracksPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call IntroductionComponent', () => {
    // when
    render(<TracksPage />);

    // then
    expect(IntroductionComponent).toHaveBeenCalled();
  });

  it('should called TracksListComponent', () => {
    // when
    render(<TracksPage />);

    // then
    expect(TracksListComponent).toHaveBeenCalled();
  });
});
