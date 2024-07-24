/* istanbul ignore file */

import { Platforms } from './platforms';

// Declarative code
export const DefaultMockDataPaths = {
  [Platforms.LEGACY]: [
    `fcp-legacy/public_fsp1_fip1.mock.ejs`,
    `fcp-legacy/private_fsp3_fip1.mock.ejs`,
    `fcp-legacy/no-display_fsp1_fip1.mock.ejs`,
  ],
  [Platforms.LOW]: [
    `fcp-low/public_fsp1-low_fip1.mock.ejs`,
    `fcp-low/private_fsp5-low_fip1.mock.ejs`,
    `fcp-low/no-display_fsp1-low_fip1.mock.ejs`,
  ],
  [Platforms.HIGH]: [
    `fcp-high/public_fsp1-high_fip1-high.mock.ejs`,
    `fcp-high/private_fsp5-high_fip1-high.mock.ejs`,
    `fcp-high/no-display_fsp1-high_fip1-high.mock.ejs`,
  ],
  [Platforms.ALL]: null,
};
