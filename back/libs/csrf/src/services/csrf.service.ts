import { Injectable } from '@nestjs/common';

import { CryptographyService } from '@fc/cryptography';
import { SessionService } from '@fc/session';

import { CsrfSession } from '../dto';
import {
  CsrfBadTokenException,
  CsrfConsumedSessionTokenException,
  CsrfMissingTokenException,
  CsrfNoSessionException,
} from '../exceptions';
import { CONSUMED_TOKEN } from '../tokens';

@Injectable()
export class CsrfService {
  constructor(
    private readonly cryptography: CryptographyService,
    private readonly session: SessionService,
  ) {}

  renew(): string {
    const csrfTokenLength = 32;
    const csrfToken: string =
      this.cryptography.genRandomString(csrfTokenLength);

    this.session.set('Csrf', { csrfToken });

    return csrfToken;
  }

  check(input: string): boolean | never {
    this.checkToken(input);

    this.session.set('Csrf', { csrfToken: CONSUMED_TOKEN });

    return true;
  }

  // Allow us to goup all checks in one place
  // eslint-disable-next-line complexity
  private checkToken(input: string): void {
    const session = this.session.get<CsrfSession>('Csrf');

    if (!input) {
      throw new CsrfMissingTokenException();
    }

    if (!session?.csrfToken) {
      throw new CsrfNoSessionException();
    }

    if (session.csrfToken === CONSUMED_TOKEN) {
      throw new CsrfConsumedSessionTokenException();
    }

    if (session.csrfToken !== input) {
      throw new CsrfBadTokenException();
    }
  }
}
