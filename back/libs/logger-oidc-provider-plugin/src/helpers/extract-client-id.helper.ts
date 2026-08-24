import { Request } from 'express';
import { decodeJwt } from 'jose';

function getClaim(token: unknown, claim: 'aud' | 'sub'): string | undefined {
  if (typeof token !== 'string') {
    return undefined;
  }

  try {
    const value = decodeJwt(token)[claim];

    return Array.isArray(value) ? value[0] : value;
  } catch {
    return undefined;
  }
}

function getClientId(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

function extractFrom(params: Record<string, unknown> = {}): string | undefined {
  return (
    getClientId(params.client_id) ||
    getClaim(params.id_token_hint, 'aud') ||
    getClaim(params.client_assertion, 'sub')
  );
}

export function extractClientId(
  request: Partial<Pick<Request, 'query' | 'body'>>,
): string | undefined {
  return extractFrom(request.query) || extractFrom(request.body);
}
