/* istanbul ignore file */

// Declarative code
import { Response } from 'express';

export type HttpErrorResponse = Response<{ code: string }>;
