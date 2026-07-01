import { MdocIssuerNameSpaces } from './mdoc-issuer-name-spaces.type';
import { MdocMsoInterface } from './mdoc-mso.interface';

/**
 * Decoded `IssuerSigned` (ISO/IEC 18013-5 §8.3.2.1.2.2).
 */
export interface MdocIssuerSignedInterface {
  readonly nameSpaces: MdocIssuerNameSpaces;
  readonly mso: MdocMsoInterface;
  readonly x509Chain: readonly Uint8Array[];
}
