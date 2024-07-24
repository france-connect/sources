import {
  compactDecrypt,
  compactVerify,
  decodeJwt,
  decodeProtectedHeader,
  importJWK,
  importSPKI,
  JWK,
  ProtectedHeaderParameters,
} from 'jose';

declare interface JwtContent {
  jweHeader?: ProtectedHeaderParameters;
  jwsHeader: ProtectedHeaderParameters;
  payload: unknown;
}

export async function getJwtContent({
  jwk,
  jwt,
}: {
  jwk?: JWK;
  jwt: string;
}): Promise<JwtContent> {
  let jws = jwt;
  let jweHeader = undefined;
  if (jwk) {
    const privateKey = await importJWK(jwk);
    const { plaintext, protectedHeader } = await compactDecrypt(
      jwt,
      privateKey,
    );
    jweHeader = protectedHeader;
    jws = new TextDecoder().decode(plaintext);
  }
  const jwsHeader = decodeProtectedHeader(jws);
  const payload = decodeJwt(jws);
  return {
    jweHeader,
    jwsHeader,
    payload,
  };
}

export async function isJwsValid({
  jws,
  sigPubKey,
}: {
  jws: string;
  sigPubKey: string;
}): Promise<boolean> {
  const sigPubJwk = await importSPKI(sigPubKey, 'ES256');

  try {
    await compactVerify(jws, sigPubJwk);
  } catch (e) {
    return false;
  }

  return true;
}
