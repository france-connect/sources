import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CsrfMissingTokenException } from '../exceptions';
import { CsrfService } from '../services';

@Injectable()
export class CsrfTokenGuard implements CanActivate {
  constructor(private readonly csrf: CsrfService) {}

  canActivate(context: ExecutionContext): boolean | never {
    const { body } = context.switchToHttp().getRequest();

    if (!body.csrfToken) {
      throw new CsrfMissingTokenException();
    }

    return this.csrf.check(body.csrfToken);
  }
}
