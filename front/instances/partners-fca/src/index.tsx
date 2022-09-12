/* istanbul ignore file */

// declarative file
import { createRoot } from 'react-dom/client';

import { Application } from './ui/application';

const container = document.getElementById('root');
/**
 * We need the "!" here in typescript
 * @see https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis
 */
const root = createRoot(container!);
root.render(<Application />);
