/* istanbul ignore file */

// Declarative code

import { Platforms, ServiceLog } from '.';

export const ServicePlatformMapping: Record<string, ServiceLog> = {
  [Platforms.LOW]: ServiceLog.LOW,
  [Platforms.HIGH]: ServiceLog.HIGH,
};
