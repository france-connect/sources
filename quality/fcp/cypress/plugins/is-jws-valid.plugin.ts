import { compactVerify, importSPKI } from 'jose';

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
