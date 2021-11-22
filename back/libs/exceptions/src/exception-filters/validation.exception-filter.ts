import { Catch, ExceptionFilter } from '@nestjs/common';

import { FcException, ValidationException } from '../exceptions';
import { FcBaseExceptionFilter } from './fc-base.exception-filter';

@Catch(ValidationException)
export class ValidationExceptionFilter
  extends FcBaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: ValidationException) {
    this.logger.debug('Exception from ValidationException');
    this.logger.error(exception.errors);
    throw new FcException(exception);
  }
}
