import { createParamDecorator } from '@nestjs/common';

import { NestJsDependencyInjectionWrapper } from '@fc/common';

import { CsrfService } from '../services';

export const CsrfToken = createParamDecorator(csrfDecorator);

export function csrfDecorator(): string {
  const csrf = NestJsDependencyInjectionWrapper.get<CsrfService>(CsrfService);

  const token = csrf.renew();

  return token;
}
