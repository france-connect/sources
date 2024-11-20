import { Test, TestingModule } from '@nestjs/testing';

import { validateCog } from '@fc/cog';
import { validateDto } from '@fc/common';
import { OidcIdentityDto } from '@fc/core-fcp/dto';
import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpDefaultIdentityCheckHandler } from './core-fcp.default.identity-check';

jest.mock('@fc/cog', () => ({
  ...(jest.requireActual('@fc/cog') as any),
  validateCog: jest.fn(),
}));

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('CoreFcpDefaultIdentityCheckHandler', () => {
  let service: CoreFcpDefaultIdentityCheckHandler;

  const loggerServiceMock = getLoggerMock();
  const sessionServiceMock = getSessionServiceMock();

  const identityMock = {
    sub: '1',
    given_name: 'given_nameValue',
    family_name: 'family_nameValue',
    email: 'emailValue',
  };

  const idpId = 'idpIdValue';
  const spId = 'spIdValue';

  let validationDtoMock;

  beforeEach(async () => {
    // before creation to get init logs.
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        SessionService,
        CoreFcpDefaultIdentityCheckHandler,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    service = module.get<CoreFcpDefaultIdentityCheckHandler>(
      CoreFcpDefaultIdentityCheckHandler,
    );

    validationDtoMock = jest.mocked(validateDto);
    sessionServiceMock.get.mockReturnValue({ idpId, spId });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    beforeEach(() => {
      service['logBirthPlaceWithBirthcountryAnomaly'] = jest.fn();
    });

    it('should log when check identity', async () => {
      // arrange
      validationDtoMock.mockResolvedValueOnce([]);

      // action
      await service.handle(identityMock);

      // expect
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        'Identity Check: ##### core-fcp-default-identity-check',
      );
    });

    it('should successfully check identity', async () => {
      // arrange
      validationDtoMock.mockResolvedValueOnce([]);

      // action
      const results = await service.handle(identityMock);

      // expect
      expect(results).toStrictEqual([]);
    });

    it('should successfully check identity with DTO', async () => {
      // arrange
      validationDtoMock.mockResolvedValueOnce([]);

      // action
      await service.handle(identityMock);

      // expect
      expect(validationDtoMock).toHaveBeenCalledTimes(1);
      expect(validationDtoMock).toHaveBeenCalledWith(
        identityMock,
        OidcIdentityDto,
        {
          whitelist: true,
          forbidNonWhitelisted: true,
          forbidUnknownValues: true,
        },
        {
          excludeExtraneousValues: true,
        },
      );
    });

    it('should failed check identity with DTO', async () => {
      // arrange
      const errorMock = new Error('Unknown Error');
      validationDtoMock.mockResolvedValueOnce([errorMock]);

      // action
      const results = await service.handle(identityMock);

      // expect
      expect(results).toStrictEqual([errorMock]);
    });

    it('should call service.logBirthPlaceWithBirthcountryAnomaly()', async () => {
      // When
      await service.handle(identityMock);

      // Then
      expect(
        service['logBirthPlaceWithBirthcountryAnomaly'],
      ).toHaveBeenCalledExactlyOnceWith(identityMock);
    });
  });

  describe('logBirthPlaceWithBirthcountryAnomaly', () => {
    const validateCogMock = jest.mocked(validateCog);

    it('should call logger.warning when birthcountry is NOT 99100 and birthplace is a valid COG', () => {
      // Given
      validateCogMock.mockReturnValue(true);
      const identityMock = {
        birthcountry: '99132',
        birthplace: 'birthplaceValue',
      };

      // When
      service['logBirthPlaceWithBirthcountryAnomaly'](identityMock);

      // Then
      expect(loggerServiceMock.warning).toHaveBeenCalledExactlyOnceWith({
        birthplace: identityMock.birthplace,
        birthcountry: identityMock.birthcountry,
        msg: 'Anomaly detected: birthplace is set but birthcountry is not France COG',
        isCog: true,
        idpId,
        spId,
      });
    });

    it('should call logger.warning when birthcountry is NOT 99100 and birthplace is NOT a valid COG', () => {
      // Given
      validateCogMock.mockReturnValue(false);
      const identityMock = {
        birthcountry: '99132',
        birthplace: 'birthplaceValue',
      };

      // When
      service['logBirthPlaceWithBirthcountryAnomaly'](identityMock);

      // Then
      expect(loggerServiceMock.warning).toHaveBeenCalledExactlyOnceWith({
        birthplace: identityMock.birthplace,
        birthcountry: identityMock.birthcountry,
        msg: 'Anomaly detected: birthplace is set but birthcountry is not France COG',
        isCog: false,
        idpId,
        spId,
      });
    });

    it('should NOT call logger.warning when birthcountry is NOT 99100 and birthplace empty string', () => {
      // Given
      const identityMock = {
        birthcountry: '99132',
        birthplace: '',
      };

      // When
      service['logBirthPlaceWithBirthcountryAnomaly'](identityMock);

      // Then
      expect(loggerServiceMock.warning).not.toHaveBeenCalled();
    });

    it('should NOT call logger.warning when birthcountry is NOT 99100 and birthplace undefined', () => {
      // Given
      const identityMock = {
        birthcountry: '99132',
      };
      // When
      service['logBirthPlaceWithBirthcountryAnomaly'](identityMock);

      // Then
      expect(loggerServiceMock.warning).not.toHaveBeenCalled();
    });

    it('should NOT call logger.warning when birthcountry is 99100', () => {
      // Given
      const identityMock = {
        birthcountry: '99100',
        birthplace: 'birthplaceValue',
      };
      // When
      service['logBirthPlaceWithBirthcountryAnomaly'](identityMock);

      // Then
      expect(loggerServiceMock.warning).not.toHaveBeenCalled();
    });
  });
});
