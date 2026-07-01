import {
  Openid4vpAuthorizationRequest,
  Openid4vpAuthorizationRequestDcApi,
  ParsedOpenid4vpAuthorizationResponse,
  parseOpenid4vpAuthorizationResponse,
} from '@openid4vc/openid4vp';

import { Injectable } from '@nestjs/common';

import { MdocDocumentInterface, MdocService } from '@fc/mdoc';

import { Openid4vpInvalidVpTokenException } from '../exceptions';
import { Openid4vpCryptoService } from './openid4vp-crypto.service';

@Injectable()
export class Openid4vpResponseService {
  constructor(
    private readonly crypto: Openid4vpCryptoService,
    private readonly mdoc: MdocService,
  ) {}

  async parseAuthorizationResponse(
    response: Record<string, unknown>,
    request: Openid4vpAuthorizationRequest | Openid4vpAuthorizationRequestDcApi,
  ): Promise<MdocDocumentInterface[]> {
    const options = {
      authorizationRequestPayload: request,
      callbacks: this.crypto.responseCallbacks,
      authorizationResponse: response,
    };

    const result = await parseOpenid4vpAuthorizationResponse(options);

    const vpToken = this.getVpToken(result);

    const documents = this.mdoc.decodeDeviceResponse(vpToken);

    this.checkDocumentsValidity(documents);

    return documents;
  }

  /**
   * @todo POC only: claims are NOT cryptographically verified yet.
   * Plug an mdoc verifier (issuerAuth + deviceAuth + valueDigests + IACA
   * trust anchor) before exposing this data to any business logic.
   */
  checkDocumentsValidity(documents: MdocDocumentInterface[]): void {
    documents.forEach((document) => {
      this.mdoc.verifyValidityInfo(document.issuerSigned.mso.validityInfo);
      this.mdoc.assertAlgorithmAllowed(
        document.deviceSigned.deviceAuth.algorithm,
      );
    });
  }

  private getVpToken(result: ParsedOpenid4vpAuthorizationResponse): string {
    const vpToken = result.authorizationResponsePayload?.vp_token;

    if (typeof vpToken !== 'string') {
      throw new Openid4vpInvalidVpTokenException();
    }

    return vpToken;
  }
}
