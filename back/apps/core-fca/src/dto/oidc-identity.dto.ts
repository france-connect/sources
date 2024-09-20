import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { MandatoryIdentityDto } from './mandatory-identity.dto';

export class OidcIdentityDto extends MandatoryIdentityDto {
  /**
   * @todo #484 Faire un validator pour siren
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/484
   */
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @IsOptional()
  @Expose()
  readonly siren?: string;

  /**
   * @todo #484 Faire un validator pour siren
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/484
   */
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @IsOptional()
  @Expose()
  readonly siret?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @IsOptional()
  @Expose()
  readonly organizational_unit?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @IsOptional()
  @Expose()
  readonly belonging_population?: string;

  @IsString()
  @MaxLength(256)
  @IsOptional()
  @Expose()
  readonly phone_number?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @IsOptional()
  @Expose()
  readonly 'chorusdt'?: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  readonly is_service_public?: boolean;
}
