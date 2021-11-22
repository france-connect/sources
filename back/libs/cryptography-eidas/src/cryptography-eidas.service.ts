import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';

import { CryptographyEidasConfig } from './dto/cryptography-eidas-config';
import { IPivotIdentity } from './interfaces/pivot-identity.interface';

@Injectable()
export class CryptographyEidasService {
  constructor(
    private readonly crypto: CryptographyService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Compute the identity hash
   * Current implementation uses sha256
   * @param pivotIdentity
   * @returns the identity hash "hex" digested
   */
  computeIdentityHash({ sub }: Pick<IPivotIdentity, 'sub'>): string {
    return this.crypto.hash(sub, 'binary', 'sha256', 'base64');
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
      this.config.get<CryptographyEidasConfig>('CryptographyEidas');

    const data = [providerRef, identityHash, subSecretKey];

    return `${this.crypto.hash(data.join(''))}v1`;
  }
}
