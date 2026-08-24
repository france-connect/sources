import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { MockWalletIdentityNotFoundException } from '../exceptions';
import { listCsvFiles, parseCsvFile } from '../helpers';
import { WalletIdentity } from '../interfaces';
import { IdentityService } from './identity.service';

jest.mock('../helpers', () => ({
  listCsvFiles: jest.fn(),
  parseCsvFile: jest.fn(),
}));

describe('IdentityService', () => {
  let service: IdentityService;

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();

  const listCsvFilesMock = jest.mocked(listCsvFiles);
  const parseCsvFileMock = jest.mocked(parseCsvFile);

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentityService, ConfigService, LoggerService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<IdentityService>(IdentityService);

    configMock.get.mockReturnValue({ identitiesCsvPath: '/data' });
    listCsvFilesMock.mockResolvedValue(['/data/eu.europa.ec.eudi.pid.1.csv']);
    parseCsvFileMock.mockResolvedValue([
      { family_name: 'DUPONT', given_name: 'JEAN' },
      { family_name: 'MARTIN', given_name: 'ALICE' },
    ]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should list the CSV files from the configured directory', async () => {
      // When
      await service.onModuleInit();

      // Then
      expect(listCsvFilesMock).toHaveBeenCalledExactlyOnceWith('/data');
    });

    it('should load identities tagged with the docType from the file name', async () => {
      // When
      await service.onModuleInit();

      // Then
      expect(service.getIdentities()).toEqual([
        {
          docType: 'eu.europa.ec.eudi.pid.1',
          attributes: { family_name: 'DUPONT', given_name: 'JEAN' },
        },
        {
          docType: 'eu.europa.ec.eudi.pid.1',
          attributes: { family_name: 'MARTIN', given_name: 'ALICE' },
        },
      ]);
    });
  });

  describe('getIdentities', () => {
    it('should return all the loaded identities', () => {
      // Given
      const identitiesMock = Symbol('identities');
      service['identities'] = identitiesMock as unknown as WalletIdentity[];

      // When
      const result = service.getIdentities();

      // Then
      expect(result).toBe(identitiesMock);
    });
  });

  describe('getIdentity', () => {
    // Given
    beforeEach(() => {
      service['identities'] = [
        {
          docType: 'eu.europa.ec.eudi.pid.1',
          attributes: { family_name: 'DUPONT', given_name: 'JEAN' },
        },
        {
          docType: 'eu.europa.ec.eudi.pid.1',
          attributes: { family_name: 'MARTIN', given_name: 'ALICE' },
        },
      ];
    });

    it('should return the identity at the given index', () => {
      // When
      const result = service.getIdentity(1);

      // Then
      expect(result.attributes.family_name).toBe('MARTIN');
    });

    it('should throw when the index is out of bounds', () => {
      // When / Then
      expect(() => service.getIdentity(99)).toThrow(
        MockWalletIdentityNotFoundException,
      );
    });

    it('should throw when no identity is loaded', () => {
      // Given
      service['identities'] = [];

      // When / Then
      expect(() => service.getIdentity(0)).toThrow(
        MockWalletIdentityNotFoundException,
      );
    });
  });
});
