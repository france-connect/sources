import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import {
  ACCESS_CONTROL_TOKEN,
  PermissionsRequestInformationsInterface,
} from '@fc/access-control';

export class PartnersAccountIdentity {
  @IsString()
  @IsNotEmpty()
  readonly sub: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;

  @IsOptional()
  @IsUUID()
  readonly id?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly updatedAt?: Date;
}

export class PartnersAccountSession {
  @IsObject()
  @ValidateNested()
  @Type(() => PartnersAccountIdentity)
  readonly identity: PartnersAccountIdentity;

  @IsObject()
  readonly [ACCESS_CONTROL_TOKEN]: Pick<
    PermissionsRequestInformationsInterface,
    'userPermissions'
  >;
}
