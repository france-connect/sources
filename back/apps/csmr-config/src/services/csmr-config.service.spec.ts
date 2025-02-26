import { Test, TestingModule } from '@nestjs/testing';

import { ConfigMessageDto } from '@fc/csmr-config-client/protocol';

import { CONFIG_DATABASE_SERVICE } from '../tokens';
import { CsmrConfigService } from './csmr-config.service';

describe('CsmrConfigService', () => {
  let service: CsmrConfigService;

  const configDatabaseMock = {
    create: jest.fn(),
    update: jest.fn(),
  };

  const createResult = Symbol('createResult');
  const updateResult = Symbol('updateResult');

  const configMock = {} as unknown as ConfigMessageDto;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrConfigService,
        {
          provide: CONFIG_DATABASE_SERVICE,
          useValue: configDatabaseMock,
        },
      ],
    }).compile();

    service = module.get<CsmrConfigService>(CsmrConfigService);

    configDatabaseMock.create.mockResolvedValue(createResult);
    configDatabaseMock.update.mockResolvedValue(updateResult);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create config with configDatabaseService', async () => {
    await service.create(configMock);

    expect(configDatabaseMock.create).toHaveBeenCalledWith(configMock);
  });

  it('should return result of create', async () => {
    const result = await service.create(configMock);

    expect(result).toBe(createResult);
  });

  it('should update config with configDatabaseService', async () => {
    await service.update(configMock);

    expect(configDatabaseMock.update).toHaveBeenCalledWith(configMock);
  });

  it('should return result of update', async () => {
    const result = await service.update(configMock);

    expect(result).toBe(updateResult);
  });
});
