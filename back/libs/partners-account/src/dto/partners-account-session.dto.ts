import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import {
  ACCESS_CONTROL_TOKEN,
  PermissionsRequestInformationsInterface,
} from '@fc/access-control';

export class PartnersAccountSession {
  @IsString()
  @IsNotEmpty()
  readonly sub: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;

  @IsString()
  readonly siren: string;

  @IsOptional()
  @IsUUID()
  readonly accountId?: string;

  @IsOptional()
  @IsObject()
  readonly [ACCESS_CONTROL_TOKEN]?: Pick<
    PermissionsRequestInformationsInterface,
    'userPermissions'
  >;
}
