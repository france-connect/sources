import { Injectable } from '@nestjs/common';

import { MdocAlgorithmsEnum } from '../enums';
import {
  MdocSignatureException,
  MdocValidityPeriodException,
  MdocValidityWindowException,
} from '../exceptions';
import { MdocValidityInfoInterface } from '../interfaces';

const SUPPORTED_ALGORITHMS = new Set<MdocAlgorithmsEnum>([
  MdocAlgorithmsEnum.ES256,
  MdocAlgorithmsEnum.ES384,
  MdocAlgorithmsEnum.ES512,
]);

/**
 * Structural checks that do not require an `MdocContext` from `@owf/mdoc`
 * (algorithm whitelist, validity window). Full COSE / device binding
 * verification uses `Verifier.verifyDeviceResponse` with a context and is
 * done in the wallet-bridge Verifier layer.
 */
@Injectable()
export class MdocVerifierService {
  assertAlgorithmAllowed(algorithm: MdocAlgorithmsEnum): void {
    if (!SUPPORTED_ALGORITHMS.has(algorithm)) {
      throw new MdocSignatureException();
    }
  }

  verifyValidityInfo(
    validityInfo: MdocValidityInfoInterface,
    now: Date = new Date(),
  ): void {
    if (this.hasIncoherentValidityWindow(validityInfo)) {
      throw new MdocValidityWindowException();
    }
    if (!this.isWithinValidityPeriod(validityInfo, now)) {
      throw new MdocValidityPeriodException();
    }
  }

  private hasIncoherentValidityWindow(
    validityInfo: MdocValidityInfoInterface,
  ): boolean {
    return validityInfo.validFrom.getTime() > validityInfo.validUntil.getTime();
  }

  private isWithinValidityPeriod(
    validityInfo: MdocValidityInfoInterface,
    now: Date,
  ): boolean {
    const nowTime = now.getTime();
    const isSignedReached = validityInfo.signed.getTime() <= nowTime;
    const isReachedValidFrom = nowTime >= validityInfo.validFrom.getTime();
    const isBeforeValidUntil = nowTime <= validityInfo.validUntil.getTime();

    return isSignedReached && isReachedValidFrom && isBeforeValidUntil;
  }
}
