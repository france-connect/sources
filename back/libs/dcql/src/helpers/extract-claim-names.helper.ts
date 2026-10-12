import {
  DcqlClaimQueryInterface,
  DcqlCredentialQueryInterface,
  DcqlQueryInterface,
} from '../interfaces';

export function extractClaimNames(query: DcqlQueryInterface): string[] {
  return unique(query.credentials.flatMap(collectCredentialClaimNames));
}

export function extractClaimName(
  claim: DcqlClaimQueryInterface,
): string | undefined {
  const last = claim.path?.at(-1);

  return typeof last === 'string' ? last : undefined;
}

function collectCredentialClaimNames(
  credential: DcqlCredentialQueryInterface,
): string[] {
  return (credential.claims ?? [])
    .map(extractClaimName)
    .filter((name): name is string => Boolean(name));
}

function unique(names: string[]): string[] {
  return [...new Set(names)];
}
