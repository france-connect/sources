import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { Platform } from '../enums';
import {
  IAppTracksDataService,
  ICsmrTracksData,
  ICsmrTracksFieldsRawData,
} from '../interfaces';
import { CsmrTracksHighDataService } from './csmr-tracks-data-high.service';
import { CsmrTracksLegacyDataService } from './csmr-tracks-data-legacy.service';
import { CsmrTracksFormatterService } from './csmr-tracks-formatter.service';

describe('CsmrTracksFormatterService', () => {
  let service: CsmrTracksFormatterService;

  const loggerMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
  };

  const formatterFcpHighMockFormattedTracksReturnValue = Symbol(
    'formatterFcpHighMockFormattedTracksReturnValue.formattedTracks',
  );

  const formatterFcpHighMock = {
    formatTracks: jest.fn(),
  };

  const formatterLegacyMock = {
    formattedTracks: jest.fn(),
  } as unknown as IAppTracksDataService;

  const track1 = {} as SearchHit<ICsmrTracksFieldsRawData>;
  const track2 = {} as SearchHit<ICsmrTracksFieldsRawData>;
  const tracksMock: SearchHit<ICsmrTracksFieldsRawData>[] = [track1, track2];

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrTracksFormatterService,
        CsmrTracksHighDataService,
        CsmrTracksLegacyDataService,
        LoggerService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CsmrTracksHighDataService)
      .useValue(formatterFcpHighMock)
      .overrideProvider(CsmrTracksLegacyDataService)
      .useValue(formatterLegacyMock)
      .compile();

    service = module.get<CsmrTracksFormatterService>(
      CsmrTracksFormatterService,
    );

    formatterFcpHighMock.formatTracks.mockReturnValue(
      formatterFcpHighMockFormattedTracksReturnValue,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('formatTracks', () => {
    const extractDataFromFieldsReturnValue = {};
    const FirstCallToGenerateTracksReturnValue = [
      'FirstCallToGenerateTracksReturnValue',
    ];
    const SecondCallToGenerateTracksReturnValue = [
      'SecondCallToGenerateTracksReturnValue',
    ];
    const sortTracksReturnValue = {};

    beforeEach(() => {
      service['extractDataFromFields'] = jest
        .fn()
        .mockReturnValueOnce(extractDataFromFieldsReturnValue);
      service['generateTracks'] = jest
        .fn()
        .mockReturnValueOnce(FirstCallToGenerateTracksReturnValue)
        .mockReturnValueOnce(SecondCallToGenerateTracksReturnValue);

      service['sortTracks'] = jest
        .fn()
        .mockReturnValueOnce(sortTracksReturnValue);
    });

    it('should call this.extractDataFromFields() with tracks argument', () => {
      // When
      service.formatTracks(tracksMock);
      // Then
      expect(service['extractDataFromFields']).toHaveBeenCalledTimes(1);
      expect(service['extractDataFromFields']).toHaveBeenCalledWith(tracksMock);
    });

    it('should call this.generateTracks() with result of call to this.extractDataFromFields() for FCP_HIGH and for FCP_LEGACY', () => {
      // When
      service.formatTracks(tracksMock);
      // Then
      expect(service['generateTracks']).toHaveBeenCalledTimes(2);
      expect(service['generateTracks']).toHaveBeenNthCalledWith(
        1,
        extractDataFromFieldsReturnValue,
        Platform.FCP_HIGH,
        formatterFcpHighMock,
      );
      expect(service['generateTracks']).toHaveBeenNthCalledWith(
        2,
        extractDataFromFieldsReturnValue,
        Platform.FC_LEGACY,
        formatterLegacyMock,
      );
    });

    it('should call this.sortTracks() with result from calls to this.generateTracks()', () => {
      // When
      service.formatTracks(tracksMock);
      // Then
      expect(service['sortTracks']).toHaveBeenCalledTimes(1);
      expect(service['sortTracks']).toHaveBeenCalledWith([
        ...FirstCallToGenerateTracksReturnValue,
        ...SecondCallToGenerateTracksReturnValue,
      ]);
    });

    it('should return result of call to this.sortTracks()', () => {
      // When
      const result = service.formatTracks(tracksMock);
      // Then
      expect(result).toBe(sortTracksReturnValue);
    });
  });

  describe('homogenizeDataFields', () => {
    it('should return the result of homogenizeDataFields, with spLabel equal fs_label', () => {
      // Given
      const fieldsMock = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        fs_label: 'fs_label mock',
        anyProp: 'any other prop mock',
      };
      // fieldsMock
      const result = service['homogenizeDataFields'](
        fieldsMock as unknown as ICsmrTracksFieldsRawData,
      );
      // Then
      expect(result).toStrictEqual({
        ...fieldsMock,
        spLabel: 'fs_label mock',
        platform: expect.any(String),
      });
    });

    it('should return the result of homogenizeDataFields, with spLabel equal spName', () => {
      // Given
      const fieldsMock = {
        spName: 'spName mock',
        anyProp: 'any other prop mock',
      };
      // fieldsMock
      const result = service['homogenizeDataFields'](
        fieldsMock as unknown as ICsmrTracksFieldsRawData,
      );
      // Then
      expect(result).toStrictEqual({
        ...fieldsMock,
        spLabel: 'spName mock',
        platform: expect.any(String),
      });
    });

    it('should return the result of homogenizeDataFields, with platform equal Platform.FCP_HIGH when service equal fc_core_v2_app', () => {
      // Given
      const fieldsMock = {
        spName: 'spName mock',
        anyProp: 'any other prop mock',
        service: 'fc_core_v2_app',
      };
      // fieldsMock
      const result = service['homogenizeDataFields'](
        fieldsMock as unknown as ICsmrTracksFieldsRawData,
      );
      // Then
      expect(result).toStrictEqual({
        ...fieldsMock,
        spLabel: expect.any(String),
        platform: Platform.FCP_HIGH,
      });
    });

    it('should return the result of homogenizeDataFields, with platform equal Platform.FC_LEGACY when service do not contain fc_core_v2_app', () => {
      // Given
      const fieldsMock = {
        spName: 'spName mock',
        anyProp: 'any other prop mock',
        service: 'not fc_core_v2_app',
      };
      // fieldsMock
      const result = service['homogenizeDataFields'](
        fieldsMock as unknown as ICsmrTracksFieldsRawData,
      );
      // Then
      expect(result).toStrictEqual({
        ...fieldsMock,
        spLabel: expect.any(String),
        platform: Platform.FC_LEGACY,
      });
    });

    it('should return the result of homogenizeDataFields, with platform equal Platform.FC_LEGACY when service is undefined', () => {
      // Given
      const fieldsMock = {
        spName: 'spName mock',
        anyProp: 'any other prop mock',
      };
      // fieldsMock
      const result = service['homogenizeDataFields'](
        fieldsMock as unknown as ICsmrTracksFieldsRawData,
      );
      // Then
      expect(result).toStrictEqual({
        ...fieldsMock,
        spLabel: 'spName mock',
        platform: Platform.FC_LEGACY,
      });
    });
  });

  describe('extractDataFromFields', () => {
    const docsMock = [...tracksMock];
    const docsMockMapReturnValue = [];
    beforeEach(() => {
      service['homogenizeDataFields'] = jest.fn();
      docsMock.map = jest.fn().mockReturnValueOnce(docsMockMapReturnValue);
    });

    it('should call docs argument .map() method', () => {
      service['extractDataFromFields'](docsMock);
      // Then
      expect(docsMock.map).toHaveBeenCalledTimes(1);
      expect(docsMock.map).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return result from call to docs argument .map() method', () => {
      const result = service['extractDataFromFields'](docsMock);
      // Then
      expect(result).toBe(docsMockMapReturnValue);
    });

    it('should call homogenizeDataFields 2 times with a doc as params', () => {
      // Given
      const inputMock = [
        { fields: { foo: 'bar' } },
        { fields: { fizz: 'buzz' } },
      ] as unknown as SearchHit<ICsmrTracksFieldsRawData>[];

      // When
      service['extractDataFromFields'](inputMock);
      // Then
      expect(service['homogenizeDataFields']).toHaveBeenCalledTimes(2);
      expect(service['homogenizeDataFields']).toHaveBeenNthCalledWith(1, {
        foo: 'bar',
      });
      expect(service['homogenizeDataFields']).toHaveBeenNthCalledWith(2, {
        fizz: 'buzz',
      });
    });

    it('should return the proper output', () => {
      // Given
      const inputMock = [
        { _id: 1234, fields: { foo: 'bar' } },
        { _id: 4567, fields: { fizz: 'buzz' } },
      ] as unknown as SearchHit<ICsmrTracksFieldsRawData>[];

      jest
        .mocked(service['homogenizeDataFields'])
        .mockReturnValueOnce({ foo: 'bar' } as unknown as ICsmrTracksData)
        .mockReturnValueOnce({ fizz: 'buzz' } as unknown as ICsmrTracksData);

      const expectedResult = [
        { trackId: 1234, foo: 'bar' },
        { trackId: 4567, fizz: 'buzz' },
      ];

      // When
      const result = service['extractDataFromFields'](inputMock);
      // Then
      expect(result).toEqual(expectedResult);
    });
  });

  describe('generateTracks', () => {
    const dataMock = [] as ICsmrTracksData[];
    const docsMockFilterReturnValue = [];

    beforeEach(() => {
      dataMock.filter = jest
        .fn()
        .mockReturnValueOnce(docsMockFilterReturnValue);
    });

    it('should call formatted argument formattedTracks() method with correctly filtered data', () => {
      // Given
      const obj1 = { platform: Platform.FCP_HIGH };
      const obj2 = { Platform: Platform.FC_LEGACY };
      const obj3 = { platform: Platform.FCP_HIGH };
      const obj4 = { Platform: Platform.FC_LEGACY };

      const inputMock = [obj1, obj2, obj3, obj4] as ICsmrTracksData[];
      // When
      service['generateTracks'](
        inputMock,
        Platform.FCP_HIGH,
        formatterFcpHighMock,
      );
      // Then
      expect(formatterFcpHighMock.formatTracks).toHaveBeenCalledWith([
        obj1,
        obj3,
      ]);
    });

    it('should call data argument filter() method', () => {
      //When
      service['generateTracks'](
        dataMock,
        Platform.FCP_HIGH,
        formatterFcpHighMock,
      );
      // Then
      expect(dataMock.filter).toHaveBeenCalledTimes(1);
      expect(dataMock.filter).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should call formatted argument formattedTracks() method', () => {
      //When
      service['generateTracks'](
        dataMock,
        Platform.FCP_HIGH,
        formatterFcpHighMock,
      );
      // Then
      expect(formatterFcpHighMock.formatTracks).toHaveBeenCalledTimes(1);
      expect(formatterFcpHighMock.formatTracks).toHaveBeenCalledWith(
        docsMockFilterReturnValue,
      );
    });

    it('should return result from call to formatted argument formattedTracks() method', () => {
      const result = service['generateTracks'](
        dataMock,
        Platform.FCP_HIGH,
        formatterFcpHighMock,
      );
      // Then
      expect(result).toBe(formatterFcpHighMockFormattedTracksReturnValue);
    });
  });

  describe('sortTracks', () => {
    const groupsMock = [] as ICsmrTracksOutputTrack[];

    const groupsMockSortReturnValue = Symbol('groupsMockReturnValue');
    beforeEach(() => {
      groupsMock.sort = jest
        .fn()
        .mockReturnValueOnce(groupsMockSortReturnValue);
    });

    it('should call groupes argument sort method', () => {
      // When
      service['sortTracks'](groupsMock);
      // Then
      expect(groupsMock.sort).toHaveBeenCalledTimes(1);
      expect(groupsMock.sort).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return result of call to groupes argument sort method', () => {
      // When
      const result = service['sortTracks'](groupsMock);
      // Then
      expect(result).toBe(groupsMockSortReturnValue);
    });

    it('should return properly sorted elements', () => {
      // Given
      const item1 = { time: 1 };
      const item2 = { time: 2 };
      const item3 = { time: 3 };
      const item4 = { time: 4 };

      const inputMocks = [
        item2,
        item4,
        item3,
        item1,
      ] as ICsmrTracksOutputTrack[];
      const sortedMocks = [item1, item2, item3, item4];
      // When
      const result = service['sortTracks'](inputMocks);
      // Then
      expect(result).toEqual(sortedMocks);
    });
  });
});
