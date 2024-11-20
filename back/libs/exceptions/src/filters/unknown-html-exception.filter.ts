import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';

import { UnknownException } from '../exceptions';
import { BaseException } from '../exceptions/base.exception';
import { FcWebHtmlExceptionFilter } from './fc-web-html-exception.filter';

@Catch()
@Injectable()
export class UnknownHtmlExceptionFilter
  extends FcWebHtmlExceptionFilter
  implements ExceptionFilter
{
  catch(exception: BaseException, host: ArgumentsHost) {
    const wrapped = new UnknownException(exception);

    super.catch(wrapped, host);
  }
}
