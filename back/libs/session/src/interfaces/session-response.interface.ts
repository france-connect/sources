/* istanbul ignore file */

// declarative code
import { ISessionCookieOptions } from './session-cookie-options.interface';

export interface ISessionResponse {
  locals?: { session: unknown };
  cookie(name: string, value: string, options: ISessionCookieOptions);
}
