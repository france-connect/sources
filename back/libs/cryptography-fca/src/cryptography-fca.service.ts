import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';

import { CryptographyFcaConfig } from './dto/cryptography-fca-config';
import { IAgentIdentity } from './interfaces';

@Injectable()
export class CryptographyFcaService {
  constructor(
    private readonly crypto: CryptographyService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Compute the identity hash
   * Current implementation uses sha256
   * @param idpId the id of the Identity provider
   * @param AgentIdentity
   * @returns the identity hash "hex" digested
   */
  computeIdentityHash(idpId: string, { uid }: IAgentIdentity): string {
    const { hashSecretKey } =
      this.config.get<CryptographyFcaConfig>('CryptographyFca');

    const serial = idpId + uid + hashSecretKey;

    return this.crypto.hash(serial, 'binary', 'sha256', 'base64');
  }

  /**
   * Compute the sub given an identity hash
   * Current implementation uses Hash sha256
   * @param providerRef the reference used to identify the provider
   * @param identityHash the identity hash computed by calling "computeIdentityHash"
   * @returns the sub "hex" digested"
   */
  computeSubV1(providerRef: string, identityHash: string): string {
    const { subSecretKey } =
      this.config.get<CryptographyFcaConfig>('CryptographyFca');

    const data = [providerRef, identityHash, subSecretKey];

    return `${this.crypto.hash(data.join(''))}`;
  }
}
