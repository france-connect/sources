import { Injectable } from '@nestjs/common';

import { MdocAlgorithmsEnum } from '../enums';
import {
  MdocDocumentInterface,
  MdocValidityInfoInterface,
} from '../interfaces';
import { MdocDecoderService } from './mdoc-decoder.service';
import { MdocVerifierService } from './mdoc-verifier.service';

/**
 * Public façade of `@fc/mdoc`. Decoding is delegated to `@owf/mdoc`
 * (`DeviceResponse`, `IssuerSigned`, …) and mapped to stable FC types.
 */
@Injectable()
export class MdocService {
  constructor(
    private readonly decoder: MdocDecoderService,
    private readonly verifier: MdocVerifierService,
  ) {}

  decodeDeviceResponse(vpToken: string | Uint8Array): MdocDocumentInterface[] {
    return this.decoder.decodeDeviceResponse(vpToken);
  }

  assertAlgorithmAllowed(algorithm: MdocAlgorithmsEnum): void {
    this.verifier.assertAlgorithmAllowed(algorithm);
  }

  verifyValidityInfo(
    validityInfo: MdocValidityInfoInterface,
    now?: Date,
  ): void {
    this.verifier.verifyValidityInfo(validityInfo, now);
  }
}
