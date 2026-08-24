import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CONFIG_NAMESPACE, MdocConfig, MdocService } from '@fc/mdoc';

import { MockWalletMdocBuildException } from '../exceptions';
import {
  RequestObjectPayload,
  WalletIdentity,
  WalletIdentityAttributes,
} from '../interfaces';

@Injectable()
export class WalletDocumentService {
  constructor(
    private readonly config: ConfigService,
    private readonly mdoc: MdocService,
  ) {}

  async buildVpToken(
    identity: WalletIdentity,
    claims: WalletIdentityAttributes,
    request: Pick<RequestObjectPayload, 'client_id' | 'nonce' | 'response_uri'>,
  ): Promise<string> {
    try {
      const mdocConfig = this.config.get<MdocConfig>(CONFIG_NAMESPACE);

      if (identity.docType !== mdocConfig.docType) {
        throw new MockWalletMdocBuildException();
      }

      return await this.mdoc.buildMdocVpToken({
        docType: mdocConfig.docType,
        claims,
        issuerPrivateKeyPem: mdocConfig.issuerPrivateKeyPem,
        issuerCertificatePem: mdocConfig.issuerCertificatePem,
        devicePrivateKeyJwk: mdocConfig.devicePrivateKeyJwk,
        deviceCertificatePem: mdocConfig.deviceCertificatePem,
        openid4vpSession: {
          clientId: request.client_id,
          nonce: request.nonce,
          responseUri: request.response_uri,
        },
      });
    } catch (error) {
      if (error instanceof MockWalletMdocBuildException) {
        throw error;
      }

      throw new MockWalletMdocBuildException(error);
    }
  }
}
