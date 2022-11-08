/* istanbul ignore file */

// Declarative code
import { ITrackingLog } from '@fc/tracking';

export class UserDashboardTrackingLogInterface extends ITrackingLog {
  sub?: string;
  sessionId: string;
  changeSetId?: string;
  payload:
    | PreferencesUpdateInfoInterface
    | PreferencesUpdateIdpInfoInterface
    | PreferencesUpdateFutureIdpInfoInterface;
}

export interface UserNetworkInfoInterface {
  ip: string;
  originalAddresses: string;
  port: string;
}

export interface PreferencesUpdateInfoInterface {
  hasAllowFutureIdpChanged: boolean;
  idpLength: number;
}

export interface PreferencesUpdateIdpInfoInterface {
  uid: string;
  name: string;
  title: string;
  allowed: boolean;
}

export interface PreferencesUpdateFutureIdpInfoInterface {
  futureAllowedNewValue: boolean;
}
