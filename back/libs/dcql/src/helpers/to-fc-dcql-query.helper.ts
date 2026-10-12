import { pick } from 'lodash';

import {
  DcqlClaimQueryInterface,
  DcqlCredentialQueryInterface,
  DcqlCredentialSetQueryInterface,
  DcqlQueryInterface,
  ParsedDcqlClaimInterface,
  ParsedDcqlCredentialInterface,
  ParsedDcqlCredentialSetInterface,
  ParsedDcqlQueryInterface,
} from '../interfaces';

export function toFcDcqlQuery(
  parsed: ParsedDcqlQueryInterface,
): DcqlQueryInterface {
  return {
    credentials: parsed.credentials.map(toFcCredential),
    ...(parsed.credential_sets !== undefined && {
      credential_sets: parsed.credential_sets.map(toFcCredentialSet),
    }),
  };
}

export function toFcCredential(
  credential: ParsedDcqlCredentialInterface,
): DcqlCredentialQueryInterface {
  const picked = pick(credential, ['id', 'format', 'meta', 'claim_sets']);

  return {
    ...picked,
    claims: credential.claims?.map(toFcClaim),
  };
}

export function toFcCredentialSet(
  credentialSet: ParsedDcqlCredentialSetInterface,
): DcqlCredentialSetQueryInterface {
  return { options: credentialSet.options };
}

export function toFcClaim(
  claim: ParsedDcqlClaimInterface,
): DcqlClaimQueryInterface {
  return pick(claim, ['id', 'path', 'intent_to_retain']);
}
