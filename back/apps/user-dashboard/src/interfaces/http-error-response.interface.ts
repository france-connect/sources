import { Response } from 'express';

export type HttpErrorResponse = Response<{ code: string }>;
