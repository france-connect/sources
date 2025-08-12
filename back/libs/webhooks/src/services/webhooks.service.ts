import { timingSafeEqual } from 'crypto';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';

import { HUB_SIGN_PREFIX } from '../constants';
import { WebhooksConfig } from '../dto';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly config: ConfigService,
    private readonly crypto: CryptographyService,
  ) {}

  sign(hookName: string, payload: string): string {
    const { secret } = this.config.get<WebhooksConfig>(hookName);

    const hmac = this.crypto.hmac(payload, secret);
    const signature = `${HUB_SIGN_PREFIX}${hmac}`;

    return signature;
  }

  verifySignature(
    hookName: string,
    payload: string,
    signature: string,
  ): boolean {
    const expectedSignature = this.sign(hookName, payload);

    if (signature.length !== expectedSignature.length) {
      return false;
    }

    return timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature),
    );
  }
}
