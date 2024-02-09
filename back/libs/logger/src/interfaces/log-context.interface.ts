/* istanbul ignore file */

// Declarative code
export interface LogContextInterface {
  requestId: string;
  sessionId?: string;
  method: string;
  path: string;
  isSuspicious?: boolean;
}
