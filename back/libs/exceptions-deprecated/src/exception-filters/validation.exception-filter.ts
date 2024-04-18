import { Catch, ExceptionFilter } from '@nestjs/common';

import { FcException, ValidationException } from '../exceptions';
import { FcBaseExceptionFilter } from './fc-base.exception-filter';

@Catch(ValidationException)
export class ValidationExceptionFilter
  extends FcBaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: ValidationException) {
    throw new FcException(exception);
  }
}
