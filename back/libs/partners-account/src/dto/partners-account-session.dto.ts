import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import {
  AccessControlAccountSession,
  AccessControlIdentityDto,
} from '@fc/access-control';

export class PartnersAccountIdentity extends AccessControlIdentityDto {
  @IsString()
  @IsNotEmpty()
  readonly sub: string;

  @IsString()
  readonly email: string;

  @ValidateIf((_, value) => value !== null)
  @IsString()
  readonly firstname: string | null;

  @ValidateIf((_, value) => value !== null)
  @IsString()
  readonly lastname: string | null;

  @IsUUID()
  readonly id: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly updatedAt?: Date;
}

export class PartnersAccountSession<
  EntityType extends string,
  PermissionType extends string,
> extends AccessControlAccountSession<EntityType, PermissionType> {
  @IsObject()
  @ValidateNested()
  @Type(() => PartnersAccountIdentity)
  readonly identity: PartnersAccountIdentity;
}
