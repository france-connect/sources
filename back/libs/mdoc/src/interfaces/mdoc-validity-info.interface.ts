/**
 * `validityInfo` block of the Mobile Security Object (ISO/IEC 18013-5).
 */
export interface MdocValidityInfoInterface {
  readonly signed: Date;
  readonly validFrom: Date;
  readonly validUntil: Date;
  readonly expectedUpdate?: Date;
}
