import { Request } from 'express';
import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { SessionService } from '@fc/session';

import { AppSession } from '../dto';
import { AppMode } from '../enums';

@Injectable()
export class AppModeInterceptor implements NestInterceptor {
  constructor(private readonly session: SessionService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest<Request>();
    const { mode = '' } = req.query;
    await this.setAppMode(mode as string);
    return next.handle();
  }

  private async setAppMode(requestMode: string): Promise<void> {
    const { mode } = this.session.get<AppSession>('App') || {};
    const currentMode = requestMode || mode || AppMode.BASIC;
    this.session.set('App', 'mode', currentMode);
    await this.session.commit();
  }
}
