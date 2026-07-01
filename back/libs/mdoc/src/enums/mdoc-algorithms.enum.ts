/**
 * COSE signature algorithms allowed when reading mdoc `IssuerAuth` /
 * `DeviceSignature` protected headers.
 *
 * Values are the COSE algorithm identifiers from IANA:
 * https://www.iana.org/assignments/cose/cose.xhtml#algorithms
 */
export enum MdocAlgorithmsEnum {
  ES256 = -7,
  ES384 = -35,
  ES512 = -36,
}
