/* istanbul ignore file */

// Declarative code
import { IsEnum, IsNotEmpty, IsObject, IsString, IsUrl } from 'class-validator';
import { JSONWebKeySet } from 'jose';

import { DekAlg, KekAlg } from '@fc/cryptography';

export class DataProviderAdapterCoreConfig {
  @IsString()
  @IsNotEmpty()
  // Based on oidc standard
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id: string;

  @IsString()
  @IsNotEmpty()
  // Based on oidc standard
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret: string;

  @IsUrl()
  readonly checktokenEndpoint: string;

  @IsUrl()
  readonly jwksEndpoint: string;

  @IsUrl()
  readonly issuer: string;

  @IsEnum(KekAlg)
  readonly checktokenSignedResponseAlg: KekAlg;

  @IsEnum(KekAlg)
  readonly checktokenEncryptedResponseAlg: KekAlg;

  @IsEnum(DekAlg)
  readonly checktokenEncryptedResponseEnc: DekAlg;

  /**
   * @TODO #143 validate the structure of JSONWebKeySet
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/143
   * When oidc-client will be using v3+ of jose feel free to replace it
   * by { keys: Keylike[] } type instead.
   */
  @IsObject()
  readonly jwks: JSONWebKeySet;
}
