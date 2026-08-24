import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';

import {
  InputDescriptor,
  PresentationDefinition,
  PresentationSubmission,
  RequestObjectPayload,
  WalletIdentity,
  WalletResponsePayload,
} from '../interfaces';
import { WalletDocumentService } from './wallet-document.service';

const MDOC_FORMAT = 'mso_mdoc';

@Injectable()
export class PresentationService {
  constructor(private readonly document: WalletDocumentService) {}

  extractRequestedClaims(definition: PresentationDefinition): string[] {
    const claims: string[] = [];

    for (const path of this.collectFieldPaths(definition)) {
      const claim = this.extractClaimName(path);

      if (claim && !claims.includes(claim)) {
        claims.push(claim);
      }
    }

    return claims;
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

  buildPresentationSubmission(
    definition: PresentationDefinition,
  ): PresentationSubmission {
    const descriptor = definition.input_descriptors[0];

    return {
      id: randomUUID(),
      definition_id: definition.id,
      descriptor_map: [
        {
          id: descriptor.id,
          format: MDOC_FORMAT,
          path: '$.vp_token',
        },
      ],
    };
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
    const { presentation_definition } = request;
    const requestedClaims = this.extractRequestedClaims(
      presentation_definition,
    );
    const claims = this.selectClaims(requestedClaims, identity);

    const vpToken = await this.document.buildVpToken(identity, claims, request);

    return {
      state: this.resolveState(request, deepLink),
      vp_token: vpToken,
      presentation_submission: this.buildPresentationSubmission(
        presentation_definition,
      ),
    };
  }

  private collectFieldPaths(definition: PresentationDefinition): string[] {
    return definition.input_descriptors.flatMap((descriptor) =>
      this.descriptorPaths(descriptor),
    );
  }

  private descriptorPaths(descriptor: InputDescriptor): string[] {
    const fields = descriptor.constraints.fields ?? [];

    return fields.flatMap((field) => field.path);
  }

  private extractClaimName(path: string): string | undefined {
    const matches = [...path.matchAll(/\['([^']+)'\]/g)];

    const [, claimName] = matches.at(-1) || [];

    return claimName;
  }
}
