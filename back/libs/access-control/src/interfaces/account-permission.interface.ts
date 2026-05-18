import { AccessControlIdentityDto } from '../dto';

export interface AccountPermissionInterface<
  A extends AccessControlIdentityDto,
  P,
> {
  account: A;
  permissionType: P;
}
