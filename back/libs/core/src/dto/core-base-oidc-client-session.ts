/* istanbul ignore file */

// Declarative file
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsAscii,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

/**
 * Metadata
 *
 * Properties about core internals
 * Those properties are always present
 */
export class CoreBaseOidcClientSessionDto {
  @IsUUID(4)
  @Expose()
  readonly browsingSessionId: string;

  @IsAscii()
  @IsNotEmpty()
  @Expose()
  readonly interactionId: string;

  @IsBoolean()
  @Expose()
  readonly isSso: boolean;

  /**
   * `stepRoute` is likely to be validated with an additional
   * @IsIn() decorator
   */
  @IsString()
  @Expose()
  readonly stepRoute: string;

  /**
   * Service Provider
   *
   * Properties about service provider
   * We always have information about a service provider
   */
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly spId: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly spName: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly spAcr: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @Expose()
  readonly spScope?: string;

  /**
   * Identity Provider
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpLabel?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpAcr?: string;

  /**
   * Identity
   *
   * Properties that represent an identity or part of an identity
   */
  @IsObject()
  @IsOptional()
  @Expose()
  readonly subs?: Record<string, string>;
}
