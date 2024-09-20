import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';

import { CryptographyFcpConfig } from './dto/cryptography-fcp-config';
import { IPivotIdentity } from './interfaces/pivot-identity.interface';

const FRANCE_COG = '99100';
@Injectable()
export class CryptographyFcpService {
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
  computeIdentityHash(
    pivotIdentity: Pick<
      IPivotIdentity,
      | 'given_name'
      | 'family_name'
      | 'birthdate'
      | 'gender'
      | 'birthplace'
      | 'birthcountry'
    >,
  ): string {
    const serial =
      pivotIdentity.given_name +
      pivotIdentity.family_name +
      pivotIdentity.birthdate +
      pivotIdentity.gender +
      this.formatBirthPlace(pivotIdentity) +
      pivotIdentity.birthcountry;

    return this.crypto.hash(serial, 'binary', 'sha256', 'base64');
  }

  /**
   * Stay compliant with legacy.
   * The birthplace was removed if the birthcountry is not FRANCE_COG,
   * we keep this behavior while v2 and legacy coexist.
   */
  private formatBirthPlace({
    birthplace,
    birthcountry,
  }: Partial<IPivotIdentity>): string {
    if (birthcountry !== FRANCE_COG) {
      return '';
    }

    return birthplace;
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

    return sub;
  }
}
