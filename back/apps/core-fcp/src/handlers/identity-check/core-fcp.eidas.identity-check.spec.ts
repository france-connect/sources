import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { EidasIdentityDto } from '@fc/core-fcp/dto';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CoreFcpEidasIdentityCheckHandler } from './core-fcp.eidas.identity-check';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('CoreFcpEidasIdentityCheckHandler', () => {
  let service: CoreFcpEidasIdentityCheckHandler;

  const loggerServiceMock = getLoggerMock();

  const identityMock = {
    sub: '1',
    given_name: 'given_nameValue',
    family_name: 'family_nameValue',
    email: 'emailValue',
  };

  let validationDtoMock;

  beforeEach(async () => {
    // before creation to get init logs.
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService, CoreFcpEidasIdentityCheckHandler],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<CoreFcpEidasIdentityCheckHandler>(
      CoreFcpEidasIdentityCheckHandler,
    );

    validationDtoMock = jest.mocked(validateDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log when check identity', async () => {
    // Given
    validationDtoMock.mockResolvedValueOnce([]);

    // When
    await service.handle(identityMock);

    // Then
    expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
    expect(loggerServiceMock.debug).toHaveBeenCalledWith(
      'Identity Check: ##### core-fcp-eidas-identity-check',
    );
  });

  it('should successfully check identity', async () => {
    // Given
    validationDtoMock.mockResolvedValueOnce([]);

    // When
    const results = await service.handle(identityMock);

    // Then
    expect(results).toStrictEqual([]);
  });

  it('should successfully check identity with DTO', async () => {
    // Given
    validationDtoMock.mockResolvedValueOnce([]);

    // When
    await service.handle(identityMock);

    // Then
    expect(validationDtoMock).toHaveBeenCalledTimes(1);
    expect(validationDtoMock).toHaveBeenCalledWith(
      identityMock,
      EidasIdentityDto,
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
    // Given
    const errorMock = new Error('Unknown Error');
    validationDtoMock.mockResolvedValueOnce([errorMock]);

    // When
    const results = await service.handle(identityMock);

    // Then
    expect(results).toStrictEqual([errorMock]);
  });
});
