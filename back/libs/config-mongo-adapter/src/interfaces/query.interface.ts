import { PlatformTechnicalKeyEnum } from '@fc/service-provider';

export interface QueryInterface {
  platform?: PlatformTechnicalKeyEnum;
  $or?: unknown[];
  $and?: unknown[];
}
