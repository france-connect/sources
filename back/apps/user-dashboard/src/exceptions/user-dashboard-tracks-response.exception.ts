import { ErrorCode } from '../enums';
import { UserDashboardBaseException } from './user-dashboard-base.exception';

// declarative code
// istanbul ignore next line
export class UserDashboardTracksResponseException extends UserDashboardBaseException {
  code = ErrorCode.TRACKS_RESPONSE;
}
