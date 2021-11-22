import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { filteredByDto } from '@fc/common';
import { LoggerLevelNames, LoggerService } from '@fc/logger';

import { CsvParsingException } from '../exceptions';
import { parseCsv } from '../helpers';
import { CSV_VALIDATOR } from '../tokens';
import { CsvService } from './csv.service';

jest.mock('../helpers');
jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  filteredByDto: jest.fn(),
}));

interface MockInterface {
  dummy: string;
}

describe('CsvService', () => {
  let service: CsvService<MockInterface>;

  class DtoMock {}
  const loggerServiceMock = {
    debug: jest.fn(),
    fatal: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsvService,
        LoggerService,
        {
          provide: CSV_VALIDATOR,
          useValue: DtoMock,
        },
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<CsvService<MockInterface>>(CsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('pickData()', () => {
    const VALIDATOR_OPTIONS = {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    };
    let filteredByDtoMock: jest.Mock;

    const inputMock = {
      alpha: 'omega',
      dummy: 'dummyValue',
    };

    const filteredSuccessMock = {
      errors: [],
      result: 'resultValue',
    };

    const filteredFailedMock = {
      errors: [new Error('ValidationError')],
      result: null,
    };

    beforeEach(() => {
      filteredByDtoMock = mocked(filteredByDto);
    });

    it('should log if filtered data by DTO is successfull', async () => {
      // Arrange
      filteredByDtoMock.mockResolvedValueOnce(filteredSuccessMock);

      // Action
      await service['pickData']([inputMock]);

      // Assert
    });
    it('should successfully filtered data by DTO', async () => {
      // Arrange
      filteredByDtoMock.mockResolvedValueOnce(filteredSuccessMock);

      const resultMock = [filteredSuccessMock.result];

      // Action
      const result = await service['pickData']([inputMock]);

      // Assert
      expect(result).toEqual(resultMock);
      expect(filteredByDtoMock).toHaveBeenCalledTimes(1);
      expect(filteredByDtoMock).toHaveBeenCalledWith(
        inputMock,
        DtoMock,
        VALIDATOR_OPTIONS,
      );
    });
    it('should fail to validate data by DTO', async () => {
      // Arrange
      filteredByDtoMock.mockResolvedValueOnce(filteredFailedMock);
      // Action
      const result = await service['pickData']([inputMock]);

      // Assert
      expect(result).toStrictEqual([]);
      expect(filteredByDtoMock).toHaveBeenCalledTimes(1);
      expect(filteredByDtoMock).toHaveBeenCalledWith(
        inputMock,
        DtoMock,
        VALIDATOR_OPTIONS,
      );
      expect(loggerServiceMock.warn).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.warn).toHaveBeenCalledWith(
        '"row n°1" was excluded from the result at DTO validation :[\n  {}\n]',
      );
    });
    it('should fail when dto crashed', async () => {
      // Arrange
      const errorMock = new Error('Unknown Error');
      filteredByDtoMock.mockRejectedValueOnce(errorMock);
      // Action
      await expect(
        service['pickData']([inputMock]),
        // Assert
      ).rejects.toThrow(errorMock);
      expect(loggerServiceMock.warn).toHaveBeenCalledTimes(0);
    });
  });

  describe('headersFilter()', () => {
    it('should lowercase the headers of the csv', () => {
      // Arrange
      const headers = ['A', 'B', 'C1'];
      const resultMock = ['a', 'b', 'c1'];
      // Action
      const fn = service['headersFilter']();
      const result = fn(headers);
      // Assert
      expect(result).toEqual(resultMock);
    });

    it('should fail if headers contains void header', () => {
      // Arrange
      const headers = ['A', undefined, 'C1'];
      // Action
      expect(
        () => {
          const fn = service['headersFilter']();
          fn(headers);
        },
        // Assert
      ).toThrow("Cannot read property 'toLowerCase' of undefined");
    });
  });

  describe('parse()', () => {
    const fileMock = 'path/to/file.csv';

    let parseCsvMock: jest.Mock;
    let pickDataMock: jest.SpyInstance;

    const csvMock = [
      {
        dummy: 'dummyValue',
      },
    ];

    beforeEach(() => {
      jest.spyOn<CsvService<MockInterface>, any>(service, 'headersFilter');

      pickDataMock = jest.spyOn<CsvService<MockInterface>, any>(
        service,
        'pickData',
      );
      pickDataMock.mockResolvedValueOnce(csvMock);

      parseCsvMock = mocked(parseCsv);
      parseCsvMock.mockResolvedValueOnce(csvMock);
    });

    it('should parse the data from CSV', async () => {
      // Arrange
      const csvOptionsMock = {
        headers: expect.any(Function),
        ignoreEmpty: true,
        trim: true,
      };

      // Action
      await service.parse(fileMock);

      // Assert
      expect(parseCsvMock).toHaveBeenCalledTimes(1);
      expect(parseCsvMock).toHaveBeenCalledWith(fileMock, csvOptionsMock);
      expect(service['collection']).toEqual(csvMock);
    });

    it('should filter and validate data from CSV', async () => {
      // Action
      await service.parse(fileMock);

      // Assert
      expect(pickDataMock).toHaveBeenCalledTimes(1);
      expect(pickDataMock).toHaveBeenCalledWith(csvMock);
      expect(service['collection']).toEqual(csvMock);
    });

    it('should trace the data extracted from CSV', async () => {
      // Arrange
      // Action
      await service.parse(fileMock);

      // Assert
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        `Loading collection...`,
      );
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledWith({
        data: csvMock,
        path: fileMock,
      });
    });

    it('should fail to validate data from csv', async () => {
      // Arrange
      const errorMock = new Error('Unknown Error');
      pickDataMock.mockReset().mockRejectedValueOnce([errorMock]);

      // Action
      await expect(service.parse(fileMock)).rejects.toThrow(
        CsvParsingException,
      );

      // Assert
      expect(pickDataMock).toHaveBeenCalledTimes(1);
      expect(pickDataMock).toHaveBeenCalledWith(csvMock);
    });

    it('should fail if parsing csv crashed', async () => {
      // Arrange
      const errorMock = new Error('Unknown Error');
      parseCsvMock.mockReset().mockRejectedValueOnce(errorMock);

      // Action
      await expect(service.parse(fileMock)).rejects.toThrow(
        CsvParsingException,
      );

      // Assert
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledWith(
        { error: errorMock, path: fileMock },
        LoggerLevelNames.ERROR,
      );
      expect(pickDataMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('find()', () => {
    it('should find in database with criteria', async () => {
      // Arrange
      const correctMock = [{ dummy: 'hello' }];
      const wrongMock = [{ hello: 'world' }, { dummy: 'world' }];
      const inputs = [...correctMock, wrongMock] as unknown as MockInterface[];

      service['collection'] = inputs;

      // Action
      const result = await service.find({ dummy: 'hello' });

      // Assert
      expect(result).toEqual(correctMock[0]);
    });

    it('should find in database with criteria', async () => {
      // Arrange
      const correctMock = [{ dummy: 'hello' }];
      const wrongMock = [{ hello: 'world' }, { dummy: 'world' }];
      const inputs = [...correctMock, wrongMock] as unknown as MockInterface[];

      service['collection'] = inputs;

      // Action
      const result = await service.find({ dummy: 'noValue' });

      // Assert
      expect(result).toEqual(null);
    });
  });
});
