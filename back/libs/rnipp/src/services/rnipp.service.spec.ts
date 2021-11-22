import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { mocked } from 'ts-jest/utils';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { FcException } from '@fc/exceptions';
import { LoggerService } from '@fc/logger';

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

  const loggerMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
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
    // openid claim
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'MARTIN',
    // openid claim
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Jean',
    birthdate: '1981-02-03',
    birthplace: '75112',
    birthcountry: '99100',
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
        LoggerService,
        RnippResponseParserService,
      ],
    })
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(RnippResponseParserService)
      .useValue(rnippResponseParserServiceMock)
      .compile();

    service = module.get<RnippService>(RnippService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have set the logger context', () => {
    expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerMock.setContext).toHaveBeenCalledWith('RnippService');
  });

  describe('check', () => {
    it('should resolve to "indentityMock" if rnippCode is 2 (FOUND_NOT_RECTIFIED), the citizen is alive and there was no error', async () => {
      // setup
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

      // action
      const result = await service.check(identityMock);

      // expect
      expect(result).toMatchObject(identityMock);
    });

    it('should resolve to "indentityMock" if rnippCode is 3 (FOUND_RECTIFIED), the citizen is alive and there was no error', async () => {
      // setup
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

      // action
      const result = await service.check(identityMock);

      // expect
      expect(result).toMatchObject(identityMock);
    });

    it('should not catch the exception thrown by "parseRnippData"', async () => {
      // setup
      service['buildRequestUrl'] = jest
        .fn()
        .mockReturnValueOnce(requestUrlMock);

      service['callRnipp'] = jest.fn().mockResolvedValueOnce(axiosResponseMock);

      rnippResponseParserServiceMock.parseRnippData.mockRejectedValueOnce(
        new FcException('parseRnippData'),
      );

      // action
      try {
        await service.check(identityMock);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(FcException);
        expect(e.message).toStrictEqual('parseRnippData');
      }

      // expect
      expect.hasAssertions();
    });

    it('should not catch the "FcException" thrown by "checkCitizenStatusError"', async () => {
      // setup
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

      // action
      try {
        await service.check(identityMock);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(FcException);
        expect(e.message).toStrictEqual('checkCitizenStatusError');
      }

      // expect
      expect.hasAssertions();
    });

    it('should not catch the "FcException" thrown by "checkRnippRectificationError"', async () => {
      // setup
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

      // action
      try {
        await service.check(identityMock);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(FcException);
        expect(e.message).toStrictEqual('checkRnippRectificationError');
      }

      // expect
      expect.hasAssertions();
    });
  });

  describe('buildRequestUrl', () => {
    it('should construct the rnipp request url using the givent identity and the configuration', () => {
      // setup
      configServiceMock.get.mockReturnValueOnce({
        protocol: 'https',
        hostname: 'rnipp.fr',
        baseUrl: '/Brpp2IdentificationComplet/individus',
      });

      // action
      const result = service['buildRequestUrl'](identityMock);

      // expect
      expect(result).toStrictEqual(requestUrlMock);
    });
  });

  describe('formatSexe', () => {
    it('should return "M" if "male" is given as argument', () => {
      // action
      const result = service['formatSexe'](Genders.MALE);

      // expect
      expect(result).toStrictEqual(Genders.ABBR_MALE);
    });

    it('should return "F" if "female" is given as argument', () => {
      // action
      const result = service['formatSexe'](Genders.FEMALE);

      // expect
      expect(result).toStrictEqual(Genders.ABBR_FEMALE);
    });

    it('should return "U" if "unspecified" is given as argument', () => {
      // action
      const result = service['formatSexe'](Genders.UNSPECIFIED);

      // expect
      expect(result).toStrictEqual(Genders.ABBR_UNSPECIFIED);
    });

    it('should return an empty string if any other argument is given', () => {
      // action
      const result = service['formatSexe']('Apache Helicopter');

      // expect
      expect(result).toStrictEqual('');
    });
  });

  describe('formatDateNaissance', () => {
    it('should return the given birthdate without any "-"', () => {
      // action
      const result = service['formatDateNaissance']('1992-04-23');

      // expect
      expect(result).toStrictEqual('19920423');
    });
  });

  describe('formatCodeLieuNaissance', () => {
    it('should return the birthplace cog if provided', () => {
      // setup
      const birthplace = '95277';
      const birthcountry = '99100';

      // action
      const result = service['formatCodeLieuNaissance'](
        birthplace,
        birthcountry,
      );

      // expect
      expect(result).toStrictEqual(birthplace);
    });

    it('should return the birthcountry cog if the birthplace cog is not provided', () => {
      // setup
      const birthplace = undefined;
      const birthcountry = '99100';

      // action
      const result = service['formatCodeLieuNaissance'](
        birthplace,
        birthcountry,
      );

      // expect
      expect(result).toStrictEqual(birthcountry);
    });
  });

  describe('callRnipp', () => {
    beforeEach(() => {
      configServiceMock.get.mockReturnValue(httpServiceConfigMock);
    });

    it('should call the "Http.get" function and with the given url', async () => {
      // setup
      httpServiceMock.get.mockReturnValue(axiosResponseMock);

      // action
      await service['callRnipp'](requestUrlMock);

      expect(httpServiceMock.get).toHaveBeenCalledTimes(1);
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        requestUrlMock,
        httpServiceConfigMock,
      );
    });

    it('should transform the "Observable" of "Http.get" result to a "Promise"', async () => {
      // setup
      const lastValueMock = mocked(lastValueFrom);
      lastValueMock.mockResolvedValueOnce(axiosResponseResolvedMock);
      httpServiceMock.get.mockReturnValue(axiosResponseMock);

      // action
      const result = service['callRnipp'](requestUrlMock);

      await result;
      expect(lastValueMock).toHaveBeenCalledTimes(1);
      expect(lastValueMock).toHaveBeenCalledWith(axiosResponseMock);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to the axiosResponseMock', async () => {
      // setup
      const lastValueMock = mocked(lastValueFrom);
      lastValueMock.mockResolvedValueOnce(axiosResponseResolvedMock);
      httpServiceMock.get.mockReturnValue(axiosResponseMock);

      // action
      const result = await service['callRnipp'](requestUrlMock);

      expect(result).toStrictEqual(axiosResponseResolvedMock);
    });

    it('should catch the exception thrown by "lastValueMock" and call "checkRnippHttpError" with the error', async () => {
      // setup
      const lastValueMock = mocked(lastValueFrom);
      const axiosErrorMock = new Error('Nani ?');
      lastValueMock.mockRejectedValueOnce(axiosErrorMock);
      httpServiceMock.get.mockReturnValue(axiosResponseMock);
      service['checkRnippHttpError'] = jest.fn();

      // action
      await service['callRnipp'](requestUrlMock);

      // expect
      expect(service['checkRnippHttpError']).toHaveBeenCalledTimes(1);
      expect(service['checkRnippHttpError']).toHaveBeenCalledWith(
        axiosErrorMock,
      );
    });

    it('should not catch the exception thrown by "checkRnippHttpError"', async () => {
      // setup
      const lastValueMock = mocked(lastValueFrom);
      const axiosErrorMock = new Error('Nani ?');
      lastValueMock.mockRejectedValueOnce(axiosErrorMock);
      httpServiceMock.get.mockReturnValue(axiosResponseMock);
      const checkRnippErrorMock = new Error('私は海賊王になります。');
      service['checkRnippHttpError'] = jest.fn().mockImplementationOnce(() => {
        throw checkRnippErrorMock;
      });

      // action
      try {
        await service['callRnipp'](requestUrlMock);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toStrictEqual(checkRnippErrorMock.message);
      }

      // expect
      expect.hasAssertions();
    });
  });

  describe('checkRnippRectificationError', () => {
    it('should throw a "RnippNotFoundSingleEchoException" error if the given "rnippCode" is 4 (NOT_FOUND_SINGLE_ECHO)', async () => {
      // setup
      const rnippCode = RnippResponseCodes.NOT_FOUND_SINGLE_ECHO;
      const deceased = false;

      // action
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippNotFoundSingleEchoException);
      }

      // expect
      expect.hasAssertions();
    });

    it('should throw a "RnippNotFoundMultipleEchoException" error if the given "rnippCode" is 6 (NOT_FOUND_MULTIPLE_ECHO)', async () => {
      // setup
      const rnippCode = RnippResponseCodes.NOT_FOUND_MULTIPLE_ECHO;
      const deceased = false;

      // action
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippNotFoundMultipleEchoException);
      }

      // expect
      expect.hasAssertions();
    });

    it('should throw a "RnippFoundOnlyWithMaritalNameException" error if the given "rnippCode" is 7 (FOUND_ONLY_WITH_MARITAL_NAME)', async () => {
      // setup
      const rnippCode = RnippResponseCodes.FOUND_ONLY_WITH_MARITAL_NAME;
      const deceased = false;

      // action
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippFoundOnlyWithMaritalNameException);
      }

      // expect
      expect.hasAssertions();
    });

    it('should throw a "RnippNotFoundNoEchoException" error if the given "rnippCode" is 8 (NOT_FOUND_NO_ECHO)', async () => {
      // setup
      const rnippCode = RnippResponseCodes.NOT_FOUND_NO_ECHO;
      const deceased = false;

      // action
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippNotFoundNoEchoException);
      }

      // expect
      expect.hasAssertions();
    });

    it('should throw a "RnippRejectedBadRequestException" error if the given "rnippCode" is 9 (REJECTED_BAD_REQUEST)', async () => {
      // setup
      const rnippCode = RnippResponseCodes.REJECTED_BAD_REQUEST;
      const deceased = false;

      // action
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippRejectedBadRequestException);
      }

      // expect
      expect.hasAssertions();
    });

    it('should throw a "RnippDeceasedException" if "deceased" argument equals "true" and the given "rnippCode" is not recognized as an error', async () => {
      // setup
      const rnippCode = '42';
      const deceased = true;

      // action
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippDeceasedException);
      }

      // expect
      expect.hasAssertions();
    });

    it('should not throw a "RnippDeceasedException" if "deceased" argument equals "true" and the given "rnippCode" is "9" (REJECTED_BAD_REQUEST)', async () => {
      // setup
      const rnippCode = RnippResponseCodes.REJECTED_BAD_REQUEST;
      const deceased = true;

      // action
      try {
        service['checkRnippRectificationError'](rnippCode, deceased);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippRejectedBadRequestException);
      }

      // expect
      expect.hasAssertions();
    });

    it('should not throw a "RnippDeceasedException" if "deceased" argument equals "false" and there is no other error', async () => {
      // setup
      const rnippCode = RnippResponseCodes.FOUND_NOT_RECTIFIED;
      const deceased = false;

      // action
      const result = service['checkRnippRectificationError'](
        rnippCode,
        deceased,
      );

      // expect
      expect(result).toBeUndefined();
    });
  });

  describe('checkRnippHttpError', () => {
    it('should throw a "RnippTimeoutException" error if the AxiosError code equals "ETIMEDOUT"', async () => {
      // setup
      const axiosErrorMock = {
        code: 'ETIMEDOUT',
      } as unknown as AxiosError;

      // action
      try {
        service['checkRnippHttpError'](axiosErrorMock);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippTimeoutException);
      }

      // expect
      expect.hasAssertions();
    });

    it('should throw a "RnippTimeoutException" error if the AxiosError code equals "ECONNABORTED"', async () => {
      // setup
      const axiosErrorMock = {
        code: 'ECONNABORTED',
      } as unknown as AxiosError;

      // action
      try {
        service['checkRnippHttpError'](axiosErrorMock);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippTimeoutException);
      }

      // expect
      expect.hasAssertions();
    });

    it('should throw a "RnippTimeoutException" error if the AxiosError code equals "ECONNRESET"', async () => {
      // setup
      const axiosErrorMock = {
        code: 'ECONNRESET',
      } as unknown as AxiosError;

      // action
      try {
        service['checkRnippHttpError'](axiosErrorMock);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippTimeoutException);
      }

      // expect
      expect.hasAssertions();
    });

    it('should throw a "RnippHttpStatusException" error if the AxiosError code is not a "timeout"', async () => {
      // setup
      const axiosErrorMock = {
        code: 'ETOTO',
      } as unknown as AxiosError;

      // action
      try {
        service['checkRnippHttpError'](axiosErrorMock);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippHttpStatusException);
      }

      // expect
      expect.hasAssertions();
    });
  });

  describe('checkCitizenStatusError', () => {
    it('should not throw if there is no error in the dto "validate" return', async () => {
      // action
      const result = service['checkCitizenStatusError']([]);

      // expect
      expect(result).toBeUndefined();
    });

    it('should throw a "RnippCitizenStatusFormatException" if there is an error in the dto "validate" return', async () => {
      // setup
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

      // action
      try {
        service['checkCitizenStatusError'](dtoValidateReturn);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(RnippCitizenStatusFormatException);
      }

      // expect
      expect.hasAssertions();
    });
  });
});
