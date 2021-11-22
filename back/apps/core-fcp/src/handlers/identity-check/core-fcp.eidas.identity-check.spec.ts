import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { EidasIdentityDto } from '@fc/core-fcp/dto';
import { LoggerService } from '@fc/logger';

import { CoreFcpEidasIdentityCheckHandler } from './core-fcp.eidas.identity-check';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('CoreFcpEidasIdentityCheckHandler', () => {
  let service: CoreFcpEidasIdentityCheckHandler;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
  } as unknown as LoggerService;

  const identityMock = {
    sub: '1',
    // oidc spec defined property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'given_nameValue',
    // eslint-disable-next-line @typescript-eslint/naming-convention
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

    validationDtoMock = mocked(validateDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  it('should log when check identity', async () => {
    // arrange
    validationDtoMock.mockResolvedValueOnce([]);

    // action
    await service.handle(identityMock);

    // expect
    expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
    expect(loggerServiceMock.debug).toHaveBeenCalledWith(
      'Identity Check: ##### core-fcp-eidas-identity-check',
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
    // arrange
    const errorMock = new Error('Unknown Error');
    validationDtoMock.mockResolvedValueOnce([errorMock]);

    // action
    const results = await service.handle(identityMock);

    // expect
    expect(results).toStrictEqual([errorMock]);
  });
});
