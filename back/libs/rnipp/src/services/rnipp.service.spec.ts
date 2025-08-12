import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { FcException } from '@fc/exceptions/exceptions';

import { Genders, RnippResponseCodes } from '../enums';
import {
  RnippCitizenStatusFormatException,
  RnippDeceasedException,
  RnippFoundOnlyWithMaritalNameException,
  RnippHttpStatusException,
  RnippNotFoundMultipleEchoException,
  RnippNotFoundNoEchoException,
  RnippNotFoundSingleEchoException,
  RnippRejectedBadRequestException,
  RnippTimeoutException,
} from '../exceptions';
import { RnippService } from './rnipp.service';
import { RnippResponseParserService } from './rnipp-response-parser.service';

jest.mock('rxjs');

describe('RnippService', () => {
  let service: RnippService;

  const httpServiceMock = {
    get: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };
  const httpServiceConfigMock = { timeout: 42 };

  const rnippResponseParserServiceMock = {
    parseRnippData: jest.fn(),
  };

  const axiosResponseResolvedMock = { data: 'foo' };
  const axiosResponseMock = {
    toPromise: jest.fn(),
  };

  const identityMock = {
    gender: Genders.MALE,
    family_name: 'MARTIN',
    given_name: 'Jean',
    given_name_array: ['Jean'],
    birthdate: '1981-02-03',
    birthplace: '75112',
    birthcountry: '99100',
    idp_birthdate: 'foo',
  };
  const requestUrlMock =
    'https://rnipp.fr/Brpp2IdentificationComplet/individus?rechercheType=S&nom=MARTIN&prenoms=Jean&dateNaissance=19810203&sexe=M&codeLieuNaissance=75112';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RnippService,
        HttpService,
        ConfigService,
        RnippResponseParserService,
      ],
    })
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(RnippResponseParserService)
      .useValue(rnippResponseParserServiceMock)
      .compile();

    service = module.get<RnippService>(RnippService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should resolve to "indentityMock" if rnippCode is 2 (FOUND_NOT_RECTIFIED), the citizen is alive and there was no error', async () => {
      // Given
      service['buildRequestUrl'] = jest
        .fn()
        .mockReturnValueOnce(requestUrlMock);

      service['callRnipp'] = jest.fn();
      (service['callRnipp'] as jest.Mock<Promise<any>>).mockResolvedValueOnce(
        axiosResponseMock,
      );

      const citizenStatusFound = {
        identity: identityMock,
        deceased: false,
        rnippCode: RnippResponseCodes.FOUND_NOT_RECTIFIED,
      };
      rnippResponseParserServiceMock.parseRnippData.mockResolvedValueOnce(
        citizenStatusFound,
      );

      service['checkCitizenStatusError'] = jest.fn();
      service['checkRnippRectificationError'] = jest.fn();

      // When
      const result = await service.check(identityMock);

      // Then
      expect(result).toMatchObject(identityMock);
    });

    it('should resolve to "indentityMock" if rnippCode is 3 (FOUND_RECTIFIED), the citizen is alive and there was no error', async () => {
      // Given
      service['buildRequestUrl'] = jest
        .fn()
        .mockReturnValueOnce(requestUrlMock);
      service['callRnipp'] = jest.fn().mockResolvedValueOnce(axiosResponseMock);

      const citizenStatusFound = {
        identity: identityMock,
        deceased: false,
        rnippCode: RnippResponseCodes.FOUND_RECTIFIED,
      };
      rnippResponseParserServiceMock.parseRnippData.mockResolvedValueOnce(
        citizenStatusFound,
      );

      service['checkCitizenStatusError'] = jest.fn();
      service['checkRnippRectificationError'] = jest.fn();

      // When
      const result = await service.check(identityMock);

      // Then
      expect(result).toMatchObject(identityMock);
    });

    it('should not catch the exception thrown by "parseRnippData"', async () => {
      // Given
      service['buildRequestUrl'] = jest
        .fn()
        .mockReturnValueOnce(requestUrlMock);

      service['callRnipp'] = jest.fn().mockResolvedValueOnce(axiosResponseMock);

      rnippResponseParserServiceMock.parseRnippData.mockRejectedValueOnce(
        new FcException('parseRnippData'),
      );

      // When
      try {
        await service.check(identityMock);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(FcException);
        expect(e.message).toStrictEqual('parseRnippData');
      }

      // Then
      expect.hasAssertions();
    });

    it('should not catch the "FcException" thrown by "checkCitizenStatusError"', async () => {
      // Given
      service['buildRequestUrl'] = jest
        .fn()
        .mockReturnValueOnce(requestUrlMock);

      service['callRnipp'] = jest.fn().mockResolvedValueOnce(axiosResponseMock);

      const citizenStatusFound = {
        identity: identityMock,
        deceased: false,
        rnippCode: RnippResponseCodes.NOT_FOUND_SINGLE_ECHO,
      };
      rnippResponseParserServiceMock.parseRnippData.mockResolvedValueOnce(
        citizenStatusFound,
      );

      service['checkCitizenStatusError'] = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new FcException('checkCitizenStatusError');
        });

      // When
      try {
        await service.check(identityMock);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(FcException);
        expect(e.message).toStrictEqual('checkCitizenStatusError');
      }

      // Then
      expect.hasAssertions();
    });

    it('should not catch the "FcException" thrown by "checkRnippRectificationError"', async () => {
      // Given
      service['buildRequestUrl'] = jest
        .fn()
        .mockReturnValueOnce(requestUrlMock);

      service['callRnipp'] = jest.fn().mockResolvedValueOnce(axiosResponseMock);

      const citizenStatusFound = {
        identity: identityMock,
        deceased: false,
        rnippCode: RnippResponseCodes.NOT_FOUND_SINGLE_ECHO,
      };
      rnippResponseParserServiceMock.parseRnippData.mockResolvedValueOnce(
        citizenStatusFound,
      );

      service['checkCitizenStatusError'] = jest.fn();
      service['checkRnippRectificationError'] = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new FcException('checkRnippRectificationError');
        });

      // When
      try {
        await service.check(identityMock);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(FcException);
        expect(e.message).toStrictEqual('checkRnippRectificationError');
      }

      // Then
      expect.hasAssertions();
    });
  });

  describe('buildRequestUrl', () => {
    it('should construct the rnipp request url using the givent identity and the configuration', () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({
        protocol: 'https',
        hostname: 'rnipp.fr',
        baseUrl: '/Brpp2IdentificationComplet/individus',
      });

      // When
      const result = service['buildRequestUrl'](identityMock);

      // Then
      expect(result).toStrictEqual(requestUrlMock);
    });
  });

  describe('formatDateNaissance', () => {
    it('should return the given birthdate without any "-"', () => {
      // When
      const result = service['formatDateNaissance']('1992-04-23');

      // Then
      expect(result).toStrictEqual('19920423');
    });
  });

  describe('formatCodeLieuNaissance', () => {
    it('should return the birthplace cog if provided', () => {
      // Given
      const birthplace = '95277';
      const birthcountry = '99100';

      // When
      const result = service['formatCodeLieuNaissance'](
        birthplace,
        birthcountry,
      );

      // Then
      expect(result).toStrictEqual(birthplace);
    });

    it('should return the birthcountry cog if the birthplace cog is not provided', () => {
      // Given
      const birthplace = undefined;
      const birthcountry = '99100';

      // When
      const result = service['formatCodeLieuNaissance'](
        birthplace,
        birthcountry,
      );

      // Then
      expect(result).toStrictEqual(birthcountry);
    });

    it('should return the birthcountry cog if the birthplace is nan empty string', () => {
      // Given
      const birthplace = '';
      const birthcountry = '99100';

      // When
      const result = service['formatCodeLieuNaissance'](
        birthplace,
        birthcountry,
      );

      // Then
      expect(result).toStrictEqual(birthcountry);
    });

    it('should return the birthcountry cog if the birthplace is not a valid cog', () => {
      // Given
      const birthplace = 'not-a-cog';
      const birthcountry = '99100';

      // When
      const result = service['formatCodeLieuNaissance'](
        birthplace,
        birthcountry,
      );

      // Then
      expect(result).toStrictEqual(birthcountry);
    });
  });

  describe('callRnipp', () => {
    beforeEach(() => {
      configServiceMock.get.mockReturnValue(httpServiceConfigMock);
    });

    it('should call the "Http.get" function and with the given url', async () => {
      // Given
      httpServiceMock.get.mockReturnValue(axiosResponseMock);

      // When
      await service['callRnipp'](requestUrlMock);

      expect(httpServiceMock.get).toHaveBeenCalledTimes(1);
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        requestUrlMock,
        httpServiceConfigMock,
      );
    });

    it('should transform the "Observable" of "Http.get" result to a "Promise"', async () => {
      // Given
      const lastValueMock = jest.mocked(lastValueFrom);
      lastValueMock.mockResolvedValueOnce(axiosResponseResolvedMock);
      httpServiceMock.get.mockReturnValue(axiosResponseMock);

      // When
      const result = service['callRnipp'](requestUrlMock);

      await result;
      expect(lastValueMock).toHaveBeenCalledTimes(1);
      expect(lastValueMock).toHaveBeenCalledWith(axiosResponseMock);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to the axiosResponseMock', async () => {
      // Given
      const lastValueMock = jest.mocked(lastValueFrom);
      lastValueMock.mockResolvedValueOnce(axiosResponseResolvedMock);
      httpServiceMock.get.mockReturnValue(axiosResponseMock);

      // When
      const result = await service['callRnipp'](requestUrlMock);

      expect(result).toStrictEqual(axiosResponseResolvedMock);
    });

    it('should catch the exception thrown by "lastValueMock" and call "checkRnippHttpError" with the error', async () => {
      // Given
      const lastValueMock = jest.mocked(lastValueFrom);
      const axiosErrorMock = new Error('Nani ?');
      lastValueMock.mockRejectedValueOnce(axiosErrorMock);
      httpServiceMock.get.mockReturnValue(axiosResponseMock);
      service['checkRnippHttpError'] = jest.fn();

      // When
      await service['callRnipp'](requestUrlMock);

      // Then
      expect(service['checkRnippHttpError']).toHaveBeenCalledTimes(1);
      expect(service['checkRnippHttpError']).toHaveBeenCalledWith(
        axiosErrorMock,
      );
    });

    it('should not catch the exception thrown by "checkRnippHttpError"', async () => {
      // Given
      const lastValueMock = jest.mocked(lastValueFrom);
      const axiosErrorMock = new Error('Nani ?');
      lastValueMock.mockRejectedValueOnce(axiosErrorMock);
      httpServiceMock.get.mockReturnValue(axiosResponseMock);
      const checkRnippErrorMock = new Error('私は海賊王になります。');
      service['checkRnippHttpError'] = jest.fn().mockImplementationOnce(() => {
        throw checkRnippErrorMock;
      });

      // When
      try {
        await service['callRnipp'](requestUrlMock);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toStrictEqual(checkRnippErrorMock.message);
      }

      // Then
      expect.hasAssertions();
    });
  });

  describe('checkRnippRectificationError', () => {
    it('should throw a "RnippNotFoundSingleEchoException" error if the given "rnippCode" is 4 (NOT_FOUND_SINGLE_ECHO)', () => {
      // Given
      const rnippCode = RnippResponseCodes.NOT_FOUND_SINGLE_ECHO;
      const deceased = false;

      // When
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippNotFoundSingleEchoException);
      }

      // Then
      expect.hasAssertions();
    });

    it('should throw a "RnippNotFoundMultipleEchoException" error if the given "rnippCode" is 6 (NOT_FOUND_MULTIPLE_ECHO)', () => {
      // Given
      const rnippCode = RnippResponseCodes.NOT_FOUND_MULTIPLE_ECHO;
      const deceased = false;

      // When
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippNotFoundMultipleEchoException);
      }

      // Then
      expect.hasAssertions();
    });

    it('should throw a "RnippFoundOnlyWithMaritalNameException" error if the given "rnippCode" is 7 (FOUND_ONLY_WITH_MARITAL_NAME)', () => {
      // Given
      const rnippCode = RnippResponseCodes.FOUND_ONLY_WITH_MARITAL_NAME;
      const deceased = false;

      // When
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippFoundOnlyWithMaritalNameException);
      }

      // Then
      expect.hasAssertions();
    });

    it('should throw a "RnippNotFoundNoEchoException" error if the given "rnippCode" is 8 (NOT_FOUND_NO_ECHO)', () => {
      // Given
      const rnippCode = RnippResponseCodes.NOT_FOUND_NO_ECHO;
      const deceased = false;

      // When
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippNotFoundNoEchoException);
      }

      // Then
      expect.hasAssertions();
    });

    it('should throw a "RnippRejectedBadRequestException" error if the given "rnippCode" is 9 (REJECTED_BAD_REQUEST)', () => {
      // Given
      const rnippCode = RnippResponseCodes.REJECTED_BAD_REQUEST;
      const deceased = false;

      // When
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippRejectedBadRequestException);
      }

      // Then
      expect.hasAssertions();
    });

    it('should throw a "RnippDeceasedException" if "deceased" argument equals "true" and the given "rnippCode" is not recognized as an error', () => {
      // Given
      const rnippCode = '42';
      const deceased = true;

      // When
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippDeceasedException);
      }

      // Then
      expect.hasAssertions();
    });

    it('should not throw a "RnippDeceasedException" if "deceased" argument equals "true" and the given "rnippCode" is "9" (REJECTED_BAD_REQUEST)', () => {
      // Given
      const rnippCode = RnippResponseCodes.REJECTED_BAD_REQUEST;
      const deceased = true;

      // When
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippRejectedBadRequestException);
      }

      // Then
      expect.hasAssertions();
    });

    it('should not throw a "RnippDeceasedException" if "deceased" argument equals "false" and there is no other error', () => {
      // Given
      const rnippCode = RnippResponseCodes.FOUND_NOT_RECTIFIED;
      const deceased = false;

      // When
      const result = service['checkRnippRectificationError'](
        rnippCode,
        deceased,
      );

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('checkRnippHttpError', () => {
    it('should throw a "RnippTimeoutException" error if the AxiosError code equals "ETIMEDOUT"', () => {
      // Given
      const axiosErrorMock = {
        code: 'ETIMEDOUT',
      } as unknown as AxiosError;

      // When
      try {
        service['checkRnippHttpError'](axiosErrorMock);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippTimeoutException);
      }

      // Then
      expect.hasAssertions();
    });

    it('should throw a "RnippTimeoutException" error if the AxiosError code equals "ECONNABORTED"', () => {
      // Given
      const axiosErrorMock = {
        code: 'ECONNABORTED',
      } as unknown as AxiosError;

      // When
      try {
        service['checkRnippHttpError'](axiosErrorMock);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippTimeoutException);
      }

      // Then
      expect.hasAssertions();
    });

    it('should throw a "RnippTimeoutException" error if the AxiosError code equals "ECONNRESET"', () => {
      // Given
      const axiosErrorMock = {
        code: 'ECONNRESET',
      } as unknown as AxiosError;

      // When
      try {
        service['checkRnippHttpError'](axiosErrorMock);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippTimeoutException);
      }

      // Then
      expect.hasAssertions();
    });

    it('should throw a "RnippHttpStatusException" error if the AxiosError code is not a "timeout"', () => {
      // Given
      const axiosErrorMock = {
        code: 'ETOTO',
      } as unknown as AxiosError;

      // When
      try {
        service['checkRnippHttpError'](axiosErrorMock);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippHttpStatusException);
      }

      // Then
      expect.hasAssertions();
    });
  });

  describe('checkCitizenStatusError', () => {
    it('should not throw if there is no error in the dto "validate" return', () => {
      // When
      const result = service['checkCitizenStatusError']([]);

      // Then
      expect(result).toBeUndefined();
    });

    it('should throw a "RnippCitizenStatusFormatException" if there is an error in the dto "validate" return', () => {
      // Given
      const dtoValidateReturn = [
        {
          property: 'foo',
          constraints: {
            Bar: 'oops !',
            Rab: 'oops too !',
          },
          children: [],
        },
      ];

      // When
      try {
        service['checkCitizenStatusError'](dtoValidateReturn);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(RnippCitizenStatusFormatException);
      }

      // Then
      expect.hasAssertions();
    });
  });
});
