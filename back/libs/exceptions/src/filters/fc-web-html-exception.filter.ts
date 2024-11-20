import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { ExceptionCaughtEvent } from '../events';
import { FcException } from '../exceptions';
import { BaseException } from '../exceptions/base.exception';
import { generateErrorId, getClass } from '../helpers';
import { FcBaseExceptionFilter } from './fc-base.exception-filter';

@Catch(FcException)
@Injectable()
export class FcWebHtmlExceptionFilter
  extends FcBaseExceptionFilter
  implements ExceptionFilter
{
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly eventBus: EventBus,
    protected readonly viewTemplate: ViewTemplateService,
  ) {
    super(config, logger, eventBus);
  }

  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const exceptionConstructor = getClass(exception);

    const code = this.getExceptionCodeFor(exception);
    const id = generateErrorId();
    const message = exceptionConstructor.UI;

    // @todo: weird Naming / structure
    const errorMessage: ApiErrorMessage = { code, id, message };
    const exceptionParam = this.getParams(exception, errorMessage, res);

    this.logException(code, id, exception);

    this.eventBus.publish(new ExceptionCaughtEvent(exception, { req }));

    this.errorOutput(exceptionParam);
  }

  protected errorOutput(errorParam: ApiErrorParams): void {
    const { httpResponseCode, res } = errorParam;

    /**
     * Interceptors are not run in case of route not handled by our app (404)
     * So we need to manually bind template helpers.
     */
    this.viewTemplate.bindMethodsToResponse(res);

    res.status(httpResponseCode);
    res.render('error', errorParam);
  }
}
