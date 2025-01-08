import { Request, Response } from 'express';

export interface AsyncLocalStorageRequestInterface {
  request?: Request;
  response?: Response;
}
