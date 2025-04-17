import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { MockServiceProviderRoutes } from '../enums';
import { MockServiceProviderAuthException } from '../exceptions';

@Catch(MockServiceProviderAuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(_exception: MockServiceProviderAuthException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res.redirect(MockServiceProviderRoutes.LOGIN);
  }
}
