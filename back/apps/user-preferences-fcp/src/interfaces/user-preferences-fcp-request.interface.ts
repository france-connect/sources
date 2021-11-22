/**
 * @todo #FC-779
 * Temporary interface for mock
 *
 * Author: Annouar LAIFA
 * Date: 18/11/2021
 */
/* istanbul ignore file */

// Declarative code
export interface UserPreferencesFcpRequest<T = unknown> {
  url?: string;
  method?: string;
  headers?: unknown;
  data?: T;
  responseType?: string;
}
