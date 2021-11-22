import { Observable, throwError } from 'rxjs';

import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { ExceptionsService } from '../exceptions.service';
import { FcBaseExceptionFilter } from './fc-base.exception-filter';

/**
 * Generic RPC exception filter
 * @see https://docs.nestjs.com/microservices/exception-filters
 */
@Catch(RpcException)
export class RpcExceptionFilter
  extends FcBaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: RpcException): Observable<any> {
    this.logger.debug('Exception from RpcException');

    const code = ExceptionsService.getExceptionCodeFor(exception);
    const id = ExceptionsService.generateErrorId();

    this.logException(code, id, exception);
    return throwError(exception.getError());
  }
}
