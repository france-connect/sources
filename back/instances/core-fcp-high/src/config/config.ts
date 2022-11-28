/* istanbul ignore file */

// Tested by DTO
import { ConfigConfig } from '@fc/config';

export default {
  templateExposed: {
    Core: { supportFormUrl: true, supportFormCodes: true },
    App: { name: true },
  },
} as ConfigConfig;
