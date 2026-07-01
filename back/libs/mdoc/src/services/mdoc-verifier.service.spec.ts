import { Test, TestingModule } from '@nestjs/testing';

import { MdocAlgorithmsEnum } from '../enums';
import {
  MdocSignatureException,
  MdocValidityPeriodException,
  MdocValidityWindowException,
} from '../exceptions';
import { MdocValidityInfoInterface } from '../interfaces';
import { MdocVerifierService } from './mdoc-verifier.service';

describe('MdocVerifierService', () => {
  let service: MdocVerifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MdocVerifierService],
    }).compile();

    service = module.get<MdocVerifierService>(MdocVerifierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('assertAlgorithmAllowed', () => {
    it('should pass for ES256', () => {
      expect(() =>
        service.assertAlgorithmAllowed(MdocAlgorithmsEnum.ES256),
      ).not.toThrow();
    });

    it('should throw MdocSignatureException for an unknown algorithm', () => {
      expect(() =>
        service.assertAlgorithmAllowed(-999 as MdocAlgorithmsEnum),
      ).toThrow(MdocSignatureException);
    });
  });

  describe('verifyValidityInfo', () => {
    // Given
    const base: MdocValidityInfoInterface = {
      signed: new Date('2026-04-01T00:00:00.000Z'),
      validFrom: new Date('2026-04-01T00:00:00.000Z'),
      validUntil: new Date('2027-04-01T00:00:00.000Z'),
    };

    it('should pass when now is inside the window', () => {
      // Given
      const now = new Date('2026-06-01T00:00:00.000Z');

      // Then / When
      expect(() => service.verifyValidityInfo(base, now)).not.toThrow();
    });

    it('should throw MdocValidityWindowException when validFrom is after validUntil', () => {
      // Given
      const invalid: MdocValidityInfoInterface = {
        ...base,
        validFrom: new Date('2027-01-01T00:00:00.000Z'),
        validUntil: new Date('2026-01-01T00:00:00.000Z'),
      };

      // Then / When
      expect(() => service.verifyValidityInfo(invalid)).toThrow(
        MdocValidityWindowException,
      );
    });

    it('should throw MdocValidityPeriodException when the document is not yet valid', () => {
      // Given
      const now = new Date('2025-01-01T00:00:00.000Z');

      // Then / When
      expect(() => service.verifyValidityInfo(base, now)).toThrow(
        MdocValidityPeriodException,
      );
    });

    it('should throw MdocValidityPeriodException when the document is expired', () => {
      // Given
      const now = new Date('2028-01-01T00:00:00.000Z');

      // Then / When
      expect(() => service.verifyValidityInfo(base, now)).toThrow(
        MdocValidityPeriodException,
      );
    });

    it('should throw MdocValidityPeriodException when signed is in the future', () => {
      // Given
      const futureSigned: MdocValidityInfoInterface = {
        ...base,
        signed: new Date('2030-01-01T00:00:00.000Z'),
      };
      const now = new Date('2026-06-01T00:00:00.000Z');

      // Then / When
      expect(() => service.verifyValidityInfo(futureSigned, now)).toThrow(
        MdocValidityPeriodException,
      );
    });
  });
});
