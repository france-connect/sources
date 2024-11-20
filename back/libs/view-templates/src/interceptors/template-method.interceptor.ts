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

    this.viewTemplate.bindMethodsToResponse(res);

    return next.handle();
  }
}
