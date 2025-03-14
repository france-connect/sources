import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CsrfService } from '../services';

@Injectable()
export class CsrfTokenGuard implements CanActivate {
  constructor(private readonly csrf: CsrfService) {}

  canActivate(context: ExecutionContext): boolean | never {
    const { body, headers } = context.switchToHttp().getRequest();

    const token = body.csrfToken || headers['x-csrf-token'];

    return this.csrf.check(token);
  }
}
