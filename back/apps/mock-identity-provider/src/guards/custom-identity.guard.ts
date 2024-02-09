import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { AppConfig } from '../dto';

@Injectable()
export class CustomIdentityGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(_context: ExecutionContext): boolean {
    const { allowCustomIdentity } = this.config.get<AppConfig>('App');

    return allowCustomIdentity;
  }
}
