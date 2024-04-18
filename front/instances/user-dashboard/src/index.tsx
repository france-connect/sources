/* istanbul ignore file */

// declarative file
import React from 'react';
import { createRoot } from 'react-dom/client';

import { Application } from './ui/application';

const container = document.getElementById('root');
/**
 * We need the "!" here in typescript
 * @see https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis
 */
const root = createRoot(container!);
// @NOTE
// The jest/require-hook rule seems to be a false positive
// despite the filter by extension in the eslint configuration
// eslint-disable-next-line jest/require-hook
root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
);
