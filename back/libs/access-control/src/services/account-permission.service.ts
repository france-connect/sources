import { Injectable } from '@nestjs/common';

import { PartnersAccountSession } from '@fc/partners-account';
import { SessionService } from '@fc/session';

import { PermissionInterface } from '../interfaces';
import { ACCESS_CONTROL_TOKEN } from '../tokens';

@Injectable()
export class AccountPermissionService {
  constructor(private readonly sessionService: SessionService) {}

  getPermissionsFromSession(): PermissionInterface[] {
    const sessionData =
      this.sessionService.get<PartnersAccountSession>('PartnersAccount');

    const { userPermissions } = sessionData[ACCESS_CONTROL_TOKEN];
    return userPermissions;
  }
}
