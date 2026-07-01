import { ServiceProviderInstanceVersionFromSpDto } from '@fc/partners-service-provider-instance-version';

export interface InstanceVersionFromSpPayloadInterface extends ServiceProviderInstanceVersionFromSpDto {
  signupId: string;
}
