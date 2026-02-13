export interface LogsInterface {
  hostname?: string;
  accountId?: string | null;
  source?: SourceInterface;
  time?: string | number;
  pid?: number;
  '@version'?: string;

  // v2
  service?: string;
  scope?: string;
  claims?: string;
  browsingSessionId?: string;

  isSso?: boolean;
  interactionId?: string | null;
  interactionAcr?: string | null;
  step?: string;
  category?: string;
  event?: string;

  dpId?: string;
  dpTitle?: string;

  spId?: string;
  spAcr?: string;
  spName?: string;
  spSub?: string | null;

  idpId?: string;
  idpAcr?: string;
  idpName?: string;
  idpLabel?: string;
  idpSub?: string | null;

  deviceTrusted?: boolean;
  deviceIsSuspicious?: string;

  logId?: string;
  level?: string;
  ip?: string;

  // legacy
  name?: string;
  action?: string;
  type_action?: string;

  fs_label?: string;
  fs?: string;
  fsId?: string;
  fsSub?: string;

  fi?: string;
  fiId?: string;
  fiSub?: string;

  userIp?: string;
  eidas?: string;
  scopes?: string;

  cinematicID?: string;
  sessionID?: string;
  tech_id?: string;
  msg?: string;
  v?: number;
}

export interface SourceInterface {
  address: string;
  port: string;
  original_addresses: string;
}
