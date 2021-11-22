/* istanbul ignore file */

// declarative code
import { Request } from 'express';

import { SessionService } from '../services';

export interface ISessionRequest extends Request {
  sessionId: string;
  sessionService: SessionService;
}
