import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { HUB_SIGN_HEADER } from '../constants/hub-sign-header.constant';
import { Webhooks } from '../decorators';
import { WebhooksService } from '../services';

@Injectable()
export class WebhooksGuard {
  constructor(
    private readonly webhooksService: WebhooksService,
    protected readonly reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers[HUB_SIGN_HEADER];

    const hookName = Webhooks.get(this.reflector, context);

    if (!signature || !hookName) {
      return false;
    }

    const payload = request.rawBody?.toString('utf-8');

    const verified = this.webhooksService.verifySignature(
      hookName,
      payload,
      signature,
    );

    return verified;
  }
}
