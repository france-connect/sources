import { Test, TestingModule } from '@nestjs/testing';

import { filteredByDto } from '@fc/common';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

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
  const loggerServiceMock = getLoggerMock();

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
  });

  describe('pickData()', () => {
    const VALIDATOR_OPTIONS = {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    };
    let filteredByDtoMock;

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
      filteredByDtoMock = jest.mocked(filteredByDto);
    });

    it('should log if filtered data by DTO is successfull', async () => {
      // Given
      filteredByDtoMock.mockResolvedValueOnce(filteredSuccessMock);

      // When
      await service['pickData']([inputMock]);

      // Then
    });
    it('should successfully filtered data by DTO', async () => {
      // Given
      filteredByDtoMock.mockResolvedValueOnce(filteredSuccessMock);

      const resultMock = [filteredSuccessMock.result];

      // When
      const result = await service['pickData']([inputMock]);

      // Then
      expect(result).toEqual(resultMock);
      expect(filteredByDtoMock).toHaveBeenCalledTimes(1);
      expect(filteredByDtoMock).toHaveBeenCalledWith(
        inputMock,
        DtoMock,
        VALIDATOR_OPTIONS,
      );
    });
    it('should fail to validate data by DTO', async () => {
      // Given
      filteredByDtoMock.mockResolvedValueOnce(filteredFailedMock);
      // When
      const result = await service['pickData']([inputMock]);

      // Then
      expect(result).toStrictEqual([]);
      expect(filteredByDtoMock).toHaveBeenCalledTimes(1);
      expect(filteredByDtoMock).toHaveBeenCalledWith(
        inputMock,
        DtoMock,
        VALIDATOR_OPTIONS,
      );
      expect(loggerServiceMock.warning).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.warning).toHaveBeenCalledWith(
        '"row n°1" was excluded from the result at DTO validation :[\n  {}\n]',
      );
    });
    it('should fail when dto crashed', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      filteredByDtoMock.mockRejectedValueOnce(errorMock);
      // When
      await expect(
        service['pickData']([inputMock]),
        // Then
      ).rejects.toThrow(errorMock);
      expect(loggerServiceMock.warning).toHaveBeenCalledTimes(0);
    });
  });

  describe('headersFilter()', () => {
    it('should lowercase the headers of the csv', () => {
      // Given
      const headers = ['A', 'B', 'C1'];
      const resultMock = ['a', 'b', 'c1'];
      // When
      const fn = service['headersFilter']();
      const result = fn(headers);
      // Then
      expect(result).toEqual(resultMock);
    });

    it('should fail if headers contains void header', () => {
      // Given
      const headers = ['A', undefined, 'C1'];
      // When
      expect(
        () => {
          const fn = service['headersFilter']();
          fn(headers);
        },
        // Then
      ).toThrow();
    });
  });

  describe('parse()', () => {
    const fileMock = 'path/to/file.csv';

    let parseCsvMock;
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

      parseCsvMock = jest.mocked(parseCsv);
      parseCsvMock.mockResolvedValueOnce(csvMock);
    });

    it('should parse the data from CSV', async () => {
      // Given
      const csvOptionsMock = {
        headers: expect.any(Function),
        ignoreEmpty: true,
        trim: true,
      };

      // When
      await service.parse(fileMock);

      // Then
      expect(parseCsvMock).toHaveBeenCalledTimes(1);
      expect(parseCsvMock).toHaveBeenCalledWith(fileMock, csvOptionsMock);
      expect(service['collection']).toEqual(csvMock);
    });

    it('should filter and validate data from CSV', async () => {
      // When
      await service.parse(fileMock);

      // Then
      expect(pickDataMock).toHaveBeenCalledTimes(1);
      expect(pickDataMock).toHaveBeenCalledWith(csvMock);
      expect(service['collection']).toEqual(csvMock);
    });

    it('should trace the data extracted from CSV', async () => {
      // Given
      // When
      await service.parse(fileMock);

      // Then
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        `Loading collection...`,
      );
    });

    it('should fail to validate data from csv', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      pickDataMock.mockReset().mockRejectedValueOnce([errorMock]);

      // When
      await expect(service.parse(fileMock)).rejects.toThrow(
        CsvParsingException,
      );

      // Then
      expect(pickDataMock).toHaveBeenCalledTimes(1);
      expect(pickDataMock).toHaveBeenCalledWith(csvMock);
    });

    it('should fail if parsing csv crashed', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      parseCsvMock.mockReset().mockRejectedValueOnce(errorMock);

      // When
      await expect(service.parse(fileMock)).rejects.toThrow(
        CsvParsingException,
      );

      // Then
      expect(pickDataMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('find()', () => {
    it('should find in database with criteria', async () => {
      // Given
      const correctMock = [{ dummy: 'hello' }];
      const wrongMock = [{ hello: 'world' }, { dummy: 'world' }];
      const inputs = [...correctMock, wrongMock] as unknown as MockInterface[];

      service['collection'] = inputs;

      // When
      const result = await service.find({ dummy: 'hello' });

      // Then
      expect(result).toEqual(correctMock[0]);
    });

    it('should find in database with criteria', async () => {
      // Given
      const correctMock = [{ dummy: 'hello' }];
      const wrongMock = [{ hello: 'world' }, { dummy: 'world' }];
      const inputs = [...correctMock, wrongMock] as unknown as MockInterface[];

      service['collection'] = inputs;

      // When
      const result = await service.find({ dummy: 'noValue' });

      // Then
      expect(result).toEqual(null);
    });
  });
});
