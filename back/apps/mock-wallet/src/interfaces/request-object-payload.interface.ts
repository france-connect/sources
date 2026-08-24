import { JSONWebKeySet } from 'jose';

import { DekAlg, KekAlg } from '@fc/cryptography/enums';
import { Formats } from '@fc/openid4vp/interfaces';

export interface ClientMetadata {
  readonly jwks: JSONWebKeySet;
  readonly vp_formats: Formats;
  readonly authorization_encrypted_response_alg: KekAlg;
  readonly authorization_encrypted_response_enc: DekAlg;
}

export interface RequestObjectPayload {
  readonly response_type: string;
  readonly response_mode: string;
  readonly nonce: string;
  readonly client_id: string;
  readonly response_uri: string;
  readonly exp: number;
  readonly nbf?: number;
  readonly iat?: number;
  readonly state?: string;
  readonly client_metadata?: ClientMetadata;
  readonly presentation_definition: PresentationDefinition;
}

export interface PresentationDefinition {
  readonly id: string;
  readonly input_descriptors: InputDescriptor[];
}

export interface InputDescriptor {
  readonly id: string;
  readonly constraints: {
    readonly fields?: { readonly path: string[] }[];
  };
}
