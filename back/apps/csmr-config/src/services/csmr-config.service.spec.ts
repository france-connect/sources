import { Test, TestingModule } from '@nestjs/testing';

import {
  ConfigCreateMessageDto,
  ConfigDeleteMessageDto,
  ConfigUpdateMessageDto,
} from '@fc/csmr-config-client/protocol';

import { CONFIG_DATABASE_SERVICE } from '../tokens';
import { CsmrConfigService } from './csmr-config.service';

describe('CsmrConfigService', () => {
  let service: CsmrConfigService;

  const configDatabaseMock = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const createResult = Symbol('createResult');
  const updateResult = Symbol('updateResult');
  const deleteResult = Symbol('deleteResult');

  const configCreateMock = {} as unknown as ConfigCreateMessageDto;
  const configUpdateMock = {} as unknown as ConfigUpdateMessageDto;
  const configDeleteMock = {} as unknown as ConfigDeleteMessageDto;

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
    configDatabaseMock.delete.mockResolvedValue(deleteResult);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create config with configDatabaseService', async () => {
    await service.create(configCreateMock);

    expect(configDatabaseMock.create).toHaveBeenCalledWith(configCreateMock);
  });

  it('should return result of create', async () => {
    const result = await service.create(configCreateMock);

    expect(result).toBe(createResult);
  });

  it('should update config with configDatabaseService', async () => {
    await service.update(configUpdateMock);

    expect(configDatabaseMock.update).toHaveBeenCalledWith(configUpdateMock);
  });

  it('should return result of update', async () => {
    const result = await service.update(configUpdateMock);

    expect(result).toBe(updateResult);
  });

  it('should delete config with configDatabaseService', async () => {
    await service.delete(configDeleteMock);

    expect(configDatabaseMock.delete).toHaveBeenCalledWith(configDeleteMock);
  });

  it('should return result of delete', async () => {
    const result = await service.delete(configDeleteMock);

    expect(result).toBe(deleteResult);
  });
});
