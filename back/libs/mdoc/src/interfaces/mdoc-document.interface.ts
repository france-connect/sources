import { MdocDeviceSignedInterface, MdocIssuerSignedInterface } from '.';

/**
 * One credential document inside a `DeviceResponse` / `vp_token`.
 */
export interface MdocDocumentInterface {
  readonly docType: string;
  readonly issuerSigned: MdocIssuerSignedInterface;
  readonly deviceSigned: MdocDeviceSignedInterface;
}
