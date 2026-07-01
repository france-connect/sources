/**
 * Discriminator for `DeviceAuth` (ISO/IEC 18013-5 §9.1.3.4):
 * either a `DeviceSignature` (COSE_Sign1) or a `DeviceMac` (COSE_Mac0).
 */
export enum MdocDeviceAuthTypeEnum {
  SIGNATURE = 'signature',
  MAC = 'mac',
}
