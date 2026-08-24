import { MdocClaim } from './mdoc-claims.interface';
import { MdocOpenid4vpSession } from './mdoc-openid4vp-session.interface';

/** Inputs required to build a dev/mock mdoc `vp_token` (DeviceResponse). */
export interface BuildMdocVpTokenOptions {
  readonly docType: string;
  readonly claims: MdocClaim;
  readonly issuerPrivateKeyPem: string;
  readonly issuerCertificatePem: string;
  readonly devicePrivateKeyJwk: Record<string, unknown>;
  readonly deviceCertificatePem: string;
  readonly openid4vpSession: MdocOpenid4vpSession;
}
