import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { ViewTemplateService } from '../services';

@Injectable()
export class TemplateInterceptor implements NestInterceptor {
  constructor(private viewTemplate: ViewTemplateService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const res = context.switchToHttp().getResponse();

    /**
     * @todo Dirty workaround for consumers or other non HTTP apps.
     *
     * This should not be necessary as this lib should only be used in HTTP apps.
     * For now @fc/exceptions uses this lib regardless to the type of apps, even in consumers.
     */
    if (res.locals) {
      this.viewTemplate.bindMethodsToResponse(res);
    }

    return next.handle();
  }
}
