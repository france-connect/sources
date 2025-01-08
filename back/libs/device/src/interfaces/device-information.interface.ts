export interface DeviceInformationInterface {
  // Configuration related data
  readonly maxIdentityNumber: number;
  readonly maxIdentityTrusted: number;
  readonly identityHmacDailyTtl: number;

  // Global status
  readonly isTrusted: boolean;
  readonly shared: boolean;
  readonly isSuspicious: boolean;

  // Specific data
  readonly accountCount: number;
  readonly knownDevice: boolean;
  readonly newIdentity: boolean;
  readonly becameTrusted: boolean;
  readonly becameShared: boolean;
}
