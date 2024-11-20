import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';

import { UnknownException } from '../exceptions';
import { BaseException } from '../exceptions/base.exception';
import { FcWebJsonExceptionFilter } from './fc-web-json-exception.filter';

@Catch()
@Injectable()
export class UnknownJsonExceptionFilter
  extends FcWebJsonExceptionFilter
  implements ExceptionFilter
{
  catch(exception: BaseException, host: ArgumentsHost) {
    const wrapped = new UnknownException(exception);

    super.catch(wrapped, host);
  }
}
