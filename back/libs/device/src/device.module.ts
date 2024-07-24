/* istanbul ignore file */

// Declarative file
import { Module } from '@nestjs/common';

import {
  DeviceCookieService,
  DeviceEntriesService,
  DeviceHeaderFlagsService,
  DeviceInformationService,
  DeviceService,
} from './services';

@Module({
  providers: [
    DeviceCookieService,
    DeviceEntriesService,
    DeviceHeaderFlagsService,
    DeviceInformationService,
    DeviceService,
  ],
  exports: [DeviceService],
})
export class DeviceModule {}
