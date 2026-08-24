import { IsObject, IsString } from 'class-validator';

/** Configuration namespace `Mdoc` for mock mdoc issuance (dev fixtures). */
export class MdocConfig {
  /** mdoc doctype presented in the `vp_token`. */
  @IsString()
  readonly docType: string;

  /** PEM private key used to sign the issuer namespace. */
  @IsString()
  readonly issuerPrivateKeyPem: string;

  /** PEM certificate bundled in the issuer auth. */
  @IsString()
  readonly issuerCertificatePem: string;

  /** Device private JWK used to sign the device authentication. */
  @IsObject()
  readonly devicePrivateKeyJwk: Record<string, unknown>;

  /** PEM certificate bundled in the device signature (x5chain). */
  @IsString()
  readonly deviceCertificatePem: string;
}
