import { NextFunction, Request, Response } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { AsyncLocalStorageService } from '../async-local-storage.service';
import { AsyncLocalStorageRequestInterface } from '../interfaces';

@Injectable()
export class AsyncLocalStorageRequestMiddleware implements NestMiddleware {
  constructor(
    private readonly asyncLocalStorage: AsyncLocalStorageService<AsyncLocalStorageRequestInterface>,
  ) {}

  use(req: Request, _res: Response, next: NextFunction) {
    this.asyncLocalStorage.set('request', req);
    next();
  }
}
