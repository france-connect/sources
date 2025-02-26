import { Observable, throwError } from 'rxjs';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { ConfigService } from '@fc/config';
import { BaseException, ExceptionCaughtEvent } from '@fc/exceptions';
import { FcBaseExceptionFilter } from '@fc/exceptions/filters/fc-base.exception-filter';
import { generateErrorId } from '@fc/exceptions/helpers';
import { LoggerService } from '@fc/logger';

import { ResponseStatus } from '../enums';

@Catch()
@Injectable()
export class MicroservicesRmqExceptionFilter
  extends FcBaseExceptionFilter
  implements ExceptionFilter
{
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly eventBus: EventBus,
  ) {
    super(config, logger, eventBus);
  }

  catch(exception: BaseException, host: ArgumentsHost): Observable<never> {
    const ctx = host.switchToRpc();
    const message = ctx.getData();

    const code = this.getExceptionCodeFor(exception);
    const id = generateErrorId();

    this.logException(code, id, exception);

    this.eventBus.publish(new ExceptionCaughtEvent(exception, ctx));

    return throwError(() => ({
      meta: { message, code, id },
      type: ResponseStatus.FAILURE,
      payload: exception,
    }));
  }
}
