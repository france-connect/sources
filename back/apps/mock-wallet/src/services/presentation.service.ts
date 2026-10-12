import { Injectable } from '@nestjs/common';

import { DcqlService } from '@fc/dcql';
import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';

import { MockWalletInvalidRequestObjectPayloadException } from '../exceptions';
import {
  RequestObjectPayload,
  WalletIdentity,
  WalletResponsePayload,
} from '../interfaces';
import { WalletDocumentService } from './wallet-document.service';

@Injectable()
export class PresentationService {
  constructor(
    private readonly document: WalletDocumentService,
    private readonly dcql: DcqlService,
  ) {}

  extractRequestedClaims(request: RequestObjectPayload): string[] {
    if (!request.dcql_query) {
      throw new MockWalletInvalidRequestObjectPayloadException();
    }

    return this.dcql.extractClaimNames(this.dcql.parse(request.dcql_query));
  }

  selectClaims(
    requestedClaims: string[],
    identity: WalletIdentity,
  ): WalletIdentity['attributes'] {
    const selected: WalletIdentity['attributes'] = {};

    for (const claim of requestedClaims) {
      if (claim in identity.attributes) {
        selected[claim] = identity.attributes[claim];
      }
    }

    return selected;
  }

  resolveState(
    request: RequestObjectPayload,
    deepLink: Openid4vpDeepLinkInterface,
  ): string | undefined {
    return request.state ?? deepLink.state;
  }

  async buildResponsePayload(
    request: RequestObjectPayload,
    deepLink: Openid4vpDeepLinkInterface,
    identity: WalletIdentity,
  ): Promise<WalletResponsePayload> {
    const requestedClaims = this.extractRequestedClaims(request);
    const claims = this.selectClaims(requestedClaims, identity);
    const vpToken = await this.document.buildVpToken(identity, claims, request);

    return this.buildDcqlResponsePayload(request, deepLink, vpToken);
  }

  private buildDcqlResponsePayload(
    request: RequestObjectPayload,
    deepLink: Openid4vpDeepLinkInterface,
    vpToken: string,
  ): WalletResponsePayload {
    const state = this.resolveState(request, deepLink);

    return {
      state,
      vp_token: { [this.getDcqlCredentialId(request)]: [vpToken] },
    };
  }

  private getDcqlCredentialId(request: RequestObjectPayload): string {
    const credentialId = request.dcql_query.credentials?.[0]?.id;

    if (!credentialId) {
      throw new MockWalletInvalidRequestObjectPayloadException();
    }

    return credentialId;
  }
}
