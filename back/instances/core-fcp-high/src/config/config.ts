import { ConfigConfig } from '@fc/config';

export default {
  templateExposed: {
    Core: { supportFormUrl: true, supportFormCodes: true },
    App: {
      name: true,
      platform: true,
      eidasBridgeUid: true,
      environment: true,
    },
  },
} as ConfigConfig;
