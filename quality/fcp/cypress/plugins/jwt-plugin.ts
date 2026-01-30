import {
  compactDecrypt,
  compactVerify,
  decodeJwt,
  decodeProtectedHeader,
  importJWK,
  importSPKI,
  JWK,
} from 'jose';

import { JwtContent } from '../support/common/types';

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
    rawJwt: jws,
  };
}

export async function verifyJwsSignature({
  jws,
  keys,
  sigAlg,
}: {
  jws: string;
  keys: JWK[];
  sigAlg: string;
}): Promise<boolean> {
  const jwsHeader = decodeProtectedHeader(jws);
  if (jwsHeader.alg !== sigAlg) {
    // eslint-disable-next-line no-console
    console.error(`Expected alg=${sigAlg} but got alg=${jwsHeader.alg}`);
    return false;
  }
  const sigJwk = keys.find((key) => key.kid === jwsHeader.kid);
  if (!sigJwk) {
    // eslint-disable-next-line no-console
    console.error(`No key found for kid=${jwsHeader.kid}`);
    return false;
  }
  const publicKey = await importJWK(sigJwk);
  try {
    await compactVerify(jws, publicKey);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return false;
  }
  return true;
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return false;
  }

  return true;
}
