import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { uuid } from '@fc/common';

import { PermissionInterface } from '../interfaces';

export class PermissionDto<
  EntityType extends string,
  PermissionType extends string,
> implements PermissionInterface<EntityType, PermissionType> {
  @IsUUID()
  readonly entityId: uuid | null;

  @IsString()
  readonly entity: EntityType;

  @IsString()
  readonly permissionType: PermissionType;
}

export class AccessControlIdentityDto {
  @IsString()
  readonly email: string;
}

export class AccessControlAccountSession<
  EntityType extends string,
  PermissionType extends string,
> {
  @IsObject()
  readonly identity: AccessControlIdentityDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  readonly permissions: PermissionDto<EntityType, PermissionType>[];
}
