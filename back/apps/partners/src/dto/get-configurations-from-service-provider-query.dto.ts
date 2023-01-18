/* istanbul ignore file */

// Declarative file
import { IsUUID } from 'class-validator';

export class getConfigurationsFromServiceProviderQueryDto {
  @IsUUID(4)
  readonly serviceProviderId: string;
}
