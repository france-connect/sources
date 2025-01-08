import { Request } from 'express';

export interface RequestInformationsInterface {
  body: Request['body'];
  params: Request['params'];
  query: Request['query'];
}
