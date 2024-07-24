import { Expose } from 'class-transformer';
import {
  IsAscii,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

import { MandatoryIdentityDto } from './mandatory-identity.dto';

export class OidcIdentityDto extends MandatoryIdentityDto {
  /**
   * @todo #484 Faire un validator pour siren
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/484
   */
  @IsAscii()
  @IsOptional()
  @Expose()
  readonly siren?: string;

  /**
   * @todo #484 Faire un validator pour siren
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/484
   */
  @IsAscii()
  @IsOptional()
  @Expose()
  readonly siret?: string;

  @IsAscii()
  @MinLength(1)
  @MaxLength(256)
  @IsOptional()
  @Expose()
  readonly organizational_unit?: string;

  @IsAscii()
  @MinLength(1)
  @MaxLength(256)
  @IsOptional()
  @Expose()
  readonly belonging_population?: string;

  @IsAscii()
  @IsOptional()
  @Expose()
  readonly phone_number?: string;

  @IsAscii()
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
