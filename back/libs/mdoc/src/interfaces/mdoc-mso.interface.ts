import { MdocDigestAlgorithmsEnum } from '../enums';
import { MdocValidityInfoInterface } from './mdoc-validity-info.interface';
import { MdocValueDigests } from './mdoc-value-digests.type';

/**
 * Mobile Security Object (ISO/IEC 18013-5 §9.1.2.4), as exposed by
 * `@fc/mdoc` without leaking `@owf/mdoc` types.
 */
export interface MdocMsoInterface {
  readonly version: string;
  readonly digestAlgorithm: MdocDigestAlgorithmsEnum;
  readonly docType: string;
  readonly valueDigests: MdocValueDigests;
  readonly validityInfo: MdocValidityInfoInterface;
}
