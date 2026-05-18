import { CommonAccessControlHandlerEnum } from '@fc/access-control';

export enum AccessControlHandler {
  GLOBAL_PERMISSION = CommonAccessControlHandlerEnum.GLOBAL_PERMISSION,
  DIRECT_ENTITY = CommonAccessControlHandlerEnum.DIRECT_ENTITY,
  RELATED_ENTITY = CommonAccessControlHandlerEnum.RELATED_ENTITY,
  LINKABLE_INSTANCES = 'LINKABLE_INSTANCES',
}
