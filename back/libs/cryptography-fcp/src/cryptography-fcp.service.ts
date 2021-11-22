import { Injectable } from '@nestjs/common';

import { RequiredExcept } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';

import { CryptographyFcpConfig } from './dto/cryptography-fcp-config';
import { IPivotIdentity } from './interfaces/pivot-identity.interface';

@Injectable()
export class CryptographyFcpService {
  constructor(
    private readonly logger: LoggerService,
    private readonly crypto: CryptographyService,
    private readonly config: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Compute the identity hash
   * Current implementation uses sha256
   * @param pivotIdentity
   * @returns the identity hash "hex" digested
   */
  computeIdentityHash(
    pivotIdentity: RequiredExcept<
      IPivotIdentity,
      'sub' | 'email' | 'phone_number' | 'preferred_username'
    >,
  ): string {
    const serial =
      pivotIdentity.given_name +
      pivotIdentity.family_name +
      pivotIdentity.birthdate +
      pivotIdentity.gender +
      pivotIdentity.birthplace +
      pivotIdentity.birthcountry;

    this.logger.trace({ pivotIdentity });

    return this.crypto.hash(serial, 'binary', 'sha256', 'base64');
  }

  /**
   * Compute the sub v1, given an identity hash
   * Current implementation uses Hash sha256
   * @param providerRef the reference used to identify the provider
   * @param identityHash the identity hash computed by calling "computeIdentityHash"
   * @returns the sub "hex" digested and suffixed with "v1"
   */
  computeSubV1(providerRef: string, identityHash: string): string {
    const { subSecretKey } =
      this.config.get<CryptographyFcpConfig>('CryptographyFcp');

    const data = [providerRef, identityHash, subSecretKey];

    const sub = `${this.crypto.hash(data.join(''))}v1`;

    this.logger.trace({ providerRef, identityHash, data, sub });

    return sub;
  }
}
