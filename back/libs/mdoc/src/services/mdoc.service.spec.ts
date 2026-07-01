import { Test, TestingModule } from '@nestjs/testing';

import { MdocAlgorithmsEnum } from '../enums';
import { MdocValidityInfoInterface } from '../interfaces';
import { MdocService } from './mdoc.service';
import { MdocDecoderService } from './mdoc-decoder.service';
import { MdocVerifierService } from './mdoc-verifier.service';

describe('MdocService', () => {
  let service: MdocService;

  const decoderMock = {
    decodeDeviceResponse: jest.fn(),
  };
  const verifierMock = {
    assertAlgorithmAllowed: jest.fn(),
    verifyValidityInfo: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MdocService, MdocDecoderService, MdocVerifierService],
    })
      .overrideProvider(MdocDecoderService)
      .useValue(decoderMock)
      .overrideProvider(MdocVerifierService)
      .useValue(verifierMock)
      .compile();

    service = module.get<MdocService>(MdocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('decodeDeviceResponse', () => {
    it('should decode device response', () => {
      // When
      service.decodeDeviceResponse('token');

      // Then
      expect(decoderMock.decodeDeviceResponse).toHaveBeenCalledWith('token');
    });

    it('should return decoded documents', () => {
      // Given
      const expectedResult = [{ docType: 'x' }];
      decoderMock.decodeDeviceResponse.mockReturnValueOnce(expectedResult);

      // When
      const result = service.decodeDeviceResponse('token');

      // Then
      expect(result).toBe(expectedResult);
    });
  });

  describe('assertAlgorithmAllowed', () => {
    it('should verify algorithm is allowed', () => {
      // Given
      const algorithm = MdocAlgorithmsEnum.ES256;

      // When
      service.assertAlgorithmAllowed(algorithm);

      // Then
      expect(verifierMock.assertAlgorithmAllowed).toHaveBeenCalledWith(
        algorithm,
      );
    });
  });

  describe('verifyValidityInfo', () => {
    it('should verify validity info', () => {
      // Given
      const validityInfo = {} as MdocValidityInfoInterface;
      const now = new Date('2026-06-01T00:00:00.000Z');

      // When
      service.verifyValidityInfo(validityInfo, now);

      // Then
      expect(verifierMock.verifyValidityInfo).toHaveBeenCalledWith(
        validityInfo,
        now,
      );
    });
  });
});
