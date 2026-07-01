import { MdocDeviceAuthTypeEnum } from '../enums';
import { MdocDeviceNameSpaces } from './mdoc-device-name-spaces.type';

/**
 * Decoded `DeviceSigned` (ISO/IEC 18013-5 §8.3.2.1.2.3).
 */
export interface MdocDeviceSignedInterface {
  readonly nameSpaces: MdocDeviceNameSpaces;
  readonly deviceAuth: MdocDeviceAuthInterface;
}

/**
 * COSE `alg` from the `DeviceSignature` / `DeviceMac` protected header
 * (IANA COSE registry). Use `MdocAlgorithmsEnum` for ECDSA and the
 * matching constants from `@owf/mdoc` for MAC algorithms when needed.
 */
export interface MdocDeviceAuthInterface {
  readonly type: MdocDeviceAuthTypeEnum;
  readonly algorithm: number;
}
