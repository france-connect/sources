import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { OidcAcrConfig } from './dto';

@Injectable()
export class OidcAcrService {
  constructor(private readonly config: ConfigService) {}

  getKnownAcrValues(): string[] {
    const { acrLevels } = this.config.get<OidcAcrConfig>('OidcAcr');

    return Object.keys(acrLevels);
  }

  /**
   * Acr level is high enough to respect provider requirements
   * @param input Acr given from the user
   * @param target Acr given from the Idp
   * @returns
   */
  isAcrValid(input: string, target: string): boolean {
    const { acrLevels } = this.config.get<OidcAcrConfig>('OidcAcr');

    return acrLevels[input] >= acrLevels[target];
  }
}
