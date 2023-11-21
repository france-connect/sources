import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { IsStep } from '../decorators';
import { FlowStepsService } from '../services';

@Injectable()
export class IsStepInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
    private readonly flowStep: FlowStepsService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isFlowStep = IsStep.get(this.reflector, context);

    if (!isFlowStep) {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: this.setStep.bind(this, context),
        error: this.setStep.bind(this, context),
      }),
    );
  }

  private async setStep(context: ExecutionContext): Promise<void> {
    const req = context.switchToHttp().getRequest();

    if (!req.sessionId) {
      return;
    }

    const { urlPrefix } = this.config.get<AppConfig>('App');
    const stepRoute = req.route.path.replace(urlPrefix, '');

    this.logger.trace(`new stepRoute: ${stepRoute}`);

    await this.flowStep.setStep(req, stepRoute);
  }
}
