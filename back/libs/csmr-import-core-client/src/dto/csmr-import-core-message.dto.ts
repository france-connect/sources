import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsIn,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { scopes } from '@fc/scopes/data/fcp-low/fcp-low.scopes';
import { ClientTypeEnum, SignatureAlgorithmEnum } from '@fc/service-provider';

export class CsmrImportCoreServiceProviderDto {
  @IsString()
  @Matches(/^[0-9]{1,7}$/)
  readonly datapassId: string;

  @IsString()
  @MaxLength(256)
  @MinLength(1)
  readonly name: string;

  @IsIn(Object.keys(scopes), { each: true })
  @ArrayNotEmpty()
  @IsArray()
  readonly scopes: string[];

  @IsEnum(ClientTypeEnum)
  readonly type: ClientTypeEnum;

  @IsUrl(
    {
      // class-validator naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
      protocols: ['https'],
    },
    { each: true },
  )
  @ArrayNotEmpty()
  @IsArray()
  readonly redirect_uris: string[];

  @IsUrl(
    {
      // class-validator naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
      protocols: ['https'],
    },
    { each: true },
  )
  @ArrayNotEmpty()
  @IsArray()
  readonly post_logout_redirect_uris: string[];

  @IsEnum([SignatureAlgorithmEnum.ES256, SignatureAlgorithmEnum.RS256])
  readonly signedResponseAlg:
    | SignatureAlgorithmEnum.ES256
    | SignatureAlgorithmEnum.RS256;

  @IsEmail({}, { each: true })
  @ArrayNotEmpty()
  @IsArray()
  readonly email: string[];

  @Matches(/^0[67][0-9]{8}$/)
  readonly phone: string;

  @IsUrl(
    {
      // class-validator naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
      protocols: ['https'],
    },
    { each: true },
  )
  @ArrayNotEmpty()
  @IsArray()
  readonly site: string[];

  @IsString({ each: true })
  @IsArray()
  readonly IPServerAddressesAndRanges: string[];

  @Matches(/^$|^[A-Za-z0-9-]{32,64}$/)
  readonly entityId: string;
}

export class CsmrImportCoreMessageDto {
  @IsArray()
  readonly payload: CsmrImportCoreServiceProviderDto[];

  @IsString()
  readonly user: string;
}
