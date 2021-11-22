import { TracksListComponent } from '@fc/tracks';

import { TracksConfig } from '../../../config';
import { IntroductionComponent } from './introduction';
import { UserWelcomeComponent } from './user-welcome';

export const TracksPage = (): JSX.Element => (
  <div className="content-wrapper-lg px16" id="page-container">
    <UserWelcomeComponent />
    <IntroductionComponent />
    <TracksListComponent options={TracksConfig} />
  </div>
);

TracksPage.displayName = 'TracesPageComponent';
