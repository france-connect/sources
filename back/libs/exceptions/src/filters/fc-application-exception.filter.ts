import { Catch, ExceptionFilter, Injectable } from '@nestjs/common';

import { BaseException } from '../exceptions';
import { generateErrorId } from '../helpers';
import { FcBaseExceptionFilter } from './fc-base.exception-filter';

@Catch()
@Injectable()
export class FcApplicationExceptionFilter
  extends FcBaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: BaseException) {
    const code = this.getExceptionCodeFor(exception);
    const id = generateErrorId();

    exception.log = exception.message;

    this.logException(code, id, exception);
  }
}
