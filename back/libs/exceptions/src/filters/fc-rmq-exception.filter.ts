import { throwError } from 'rxjs';

import { Catch, ExceptionFilter, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { ExceptionCaughtEvent } from '../events';
import { BaseException } from '../exceptions';
import { generateErrorId } from '../helpers';
import { FcBaseExceptionFilter } from './fc-base.exception-filter';

@Catch()
@Injectable()
export class FcRmqExceptionFilter
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

  catch(exception: BaseException) {
    const code = this.getExceptionCodeFor(exception);
    const id = generateErrorId();

    this.logException(code, id, exception);

    this.eventBus.publish(new ExceptionCaughtEvent(exception, {}));

    return throwError(() => exception);
  }
}
