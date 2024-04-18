import { Injectable } from '@nestjs/common';

import { CryptographyService } from '@fc/cryptography';
import { SessionService } from '@fc/session';

import { CsrfSession } from '../dto';
import { CsrfBadTokenException } from '../exceptions';

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
    if (!this.isValid(input)) {
      throw new CsrfBadTokenException();
    }

    return true;
  }

  isValid(input: string): boolean {
    const session = this.session.get<CsrfSession>('Csrf');

    if (!session) {
      return false;
    }

    return session.csrfToken === input;
  }
}
