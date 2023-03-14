/* istanbul ignore file */

// Declarative file
import { IsString } from 'class-validator';

import { AcrLevels } from '../validators';

export class AcrLevelsConfig {
  readonly [label: string]: number;
}

export class OidcAcrConfig {
  /**
   * Those values must be coherent with "OidcProviderConfig.configuration.acrValues".
   * It could contain more values though (because you can know more than you accept).
   * Exemple:
   * - OidcProviderConfig.configuration.acrValues -> ['anyAcr_2', 'anyAcr_3']
   * - acrLevels -> { 'anyAcr_1': 1, 'anyAcr_2': 2, 'anyAcr_3': 3 }
   * - defaultAcrValue -> 'anyAcr_3'
   */
  @AcrLevels()
  readonly acrLevels: AcrLevelsConfig;

  @IsString()
  readonly defaultAcrValue: string;
}
