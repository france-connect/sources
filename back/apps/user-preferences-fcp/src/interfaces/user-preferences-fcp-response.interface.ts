/**
 * @todo #FC-779
 * Temporary interface for mock
 *
 * Author: Annouar LAIFA
 * Date: 18/11/2021
 */
/* istanbul ignore file */

// Declarative code
export interface UserPreferencesFcpResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  headers?: unknown;
}
