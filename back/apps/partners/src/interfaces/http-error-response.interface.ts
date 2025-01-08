import { Response } from 'express';

// !!!!!!!!!!!!!!! DUPLICATE FROM UD !!!!!!!!!!!!!!!
// @TODO create a common shared interfaces
// between user-dashboard and partners
export type HttpErrorResponse = Response<{ code: string }>;
