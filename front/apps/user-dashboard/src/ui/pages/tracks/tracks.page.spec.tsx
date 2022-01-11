import { render } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { TracksListComponent } from '@fc/tracks';

import { IntroductionComponent } from './introduction';
import { TracksPage } from './tracks.page';
import { UserWelcomeComponent } from './user-welcome';

jest.mock('@fc/tracks');
jest.mock('./introduction');
jest.mock('./user-welcome');

describe('TracksPage', () => {
  const TracksListComponentMock = mocked(TracksListComponent);
  TracksListComponentMock.mockReturnValue(<div>FooBar TracksListComponent</div>);

  it('IntroductionComponent should have been called', () => {
    // setup
    render(<TracksPage />);
    // expect
    expect(IntroductionComponent).toHaveBeenCalled();
  });

  it('UserWelcomeComponent should have been called', () => {
    // setup
    render(<TracksPage />);
    // expect
    expect(UserWelcomeComponent).toHaveBeenCalled();
  });

  it('TracksListComponent should have been called', () => {
    // setup
    render(<TracksPage />);
    // expect
    expect(TracksListComponent).toHaveBeenCalled();
  });
});
