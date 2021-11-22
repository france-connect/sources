/* istanbul ignore file */

import { Response } from 'express';

import { ApiHttpResponseCode } from '../enums';
import { ApiErrorMessage } from './api-error-message';

// Declarative code
export interface ApiErrorParams {
  error: ApiErrorMessage;
  httpResponseCode: ApiHttpResponseCode;
  res: Response;
}
