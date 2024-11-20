import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';

import { ApiContentType, ApiErrorMessage } from '@fc/app';
import { FcException } from '@fc/exceptions';
import { ExceptionCaughtEvent } from '@fc/exceptions/events';
import { FcWebJsonExceptionFilter } from '@fc/exceptions/filters';
import { generateErrorId, getClass } from '@fc/exceptions/helpers';

@Catch(FcException)
@Injectable()
export class DataProviderExceptionFilter
  extends FcWebJsonExceptionFilter
  implements ExceptionFilter
{
  catch(exception: FcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const exceptionConstructor = getClass(exception);

    const code = this.getExceptionCodeFor(exception);
    const id = generateErrorId();
    const message = exceptionConstructor.UI;

    this.logException(code, id, exception);
    this.eventBus.publish(new ExceptionCaughtEvent(exception, { req }));

    const errorMessage: ApiErrorMessage = { code, id, message };
    const params = this.getParams(exception, errorMessage, res);

    const { httpResponseCode } = params;
    res.set('Content-Type', ApiContentType.JSON);
    res.status(httpResponseCode);

    res.json({
      error: exceptionConstructor.ERROR,
      error_description: exceptionConstructor.ERROR_DESCRIPTION,
    });
  }
}
