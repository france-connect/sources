/* istanbul ignore file */

// Declarative file
import { IsUUID } from 'class-validator';

export class ServiceProviderConfigurationDto {
  @IsUUID(4)
  readonly serviceProviderId: string;
}
