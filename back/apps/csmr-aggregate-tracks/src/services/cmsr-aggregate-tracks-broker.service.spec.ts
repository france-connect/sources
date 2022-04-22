import { mocked } from 'jest-mock';
import { delay, lastValueFrom, Observable, of } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { TracksProtocol } from '@fc/microservices';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { CsmrAggregateTracksCsmrFailedException } from '../exceptions';
import { CmsrAggregateTracksBrokerService } from './cmsr-aggregate-tracks-broker.service';

jest.mock('rxjs', () => ({
  ...(jest.requireActual('rxjs') as any),
  lastValueFrom: jest.fn(),
}));

describe('CmsrAggregateTracksBrokerService', () => {
  let service: CmsrAggregateTracksBrokerService;

  const configDataMock: Partial<RabbitmqConfig> = {
    requestTimeout: 555,
  };

  const loggerMock = {
    debug: jest.fn(),
    trace: jest.fn(),
    setContext: jest.fn(),
  };

  const configMock = {
    get: jest.fn(),
  };

  const tracksHighBrokerMock = {
    send: jest.fn(),
  };

  const tracksLegacyBrokerMock = {
    send: jest.fn(),
  };

  const identityHashMock = 'identityHashMock';

  const tracksLegacyMock = [Symbol('legacy')];
  const tracksHighMock = [Symbol('high')];

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CmsrAggregateTracksBrokerService,
        LoggerService,
        ConfigService,
        {
          provide: 'TracksHighBroker',
          useValue: tracksHighBrokerMock,
        },
        {
          provide: 'TracksLegacyBroker',
          useValue: tracksLegacyBrokerMock,
        },
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<CmsrAggregateTracksBrokerService>(
      CmsrAggregateTracksBrokerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set logger context', () => {
    expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerMock.setContext).toHaveBeenCalledWith(
      'CmsrAggregateTracksBrokerService',
    );
  });

  it('Should list all brokers', () => {
    expect(service.brokers).toStrictEqual([
      tracksHighBrokerMock,
      tracksLegacyBrokerMock,
    ]);
  });

  describe('buildOrder()', () => {
    beforeEach(() => {
      const apiCallMock = of(tracksLegacyMock);
      tracksLegacyBrokerMock.send.mockReturnValueOnce(apiCallMock);
      configMock.get.mockReturnValueOnce(configDataMock);
    });
    it('Should get Observable order', () => {
      // Given

      // When
      const order$ = service['buildOrder'](
        tracksLegacyBrokerMock as unknown as ClientProxy,
        identityHashMock,
      );

      // Then
      expect(order$).toBeInstanceOf(Observable);
    });

    it('Should call broker from order', () => {
      // Given
      // When
      service['buildOrder'](
        tracksLegacyBrokerMock as unknown as ClientProxy,
        identityHashMock,
      );

      // Then
      expect(tracksLegacyBrokerMock.send).toHaveBeenCalledTimes(1);
      expect(tracksLegacyBrokerMock.send).toHaveBeenCalledWith(
        TracksProtocol.Commands.GET,
        { identityHash: identityHashMock },
      );
    });

    it('Should get tracks from broker order', (done) => {
      // Given
      // When
      const order$ = service['buildOrder'](
        tracksLegacyBrokerMock as unknown as ClientProxy,
        identityHashMock,
      );

      // Then
      order$.subscribe({
        next: (tracks) => {
          expect(tracks).toStrictEqual(tracksLegacyMock);
        },
        complete: done,
      });
    });

    it('Should trigger timeout if broker call failed', (done) => {
      // Given
      expect.assertions(2);
      const lateApiCallMock = of(tracksLegacyMock).pipe(delay(10));
      tracksLegacyBrokerMock.send
        .mockReset()
        .mockReturnValueOnce(lateApiCallMock);

      const configDataMock: Partial<RabbitmqConfig> = {
        requestTimeout: 1,
      };

      configMock.get.mockReset().mockReturnValueOnce(configDataMock);

      // When
      const order$ = service['buildOrder'](
        tracksLegacyBrokerMock as unknown as ClientProxy,
        identityHashMock,
      );

      // Then
      order$.subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          expect(error.message).toEqual('Timeout has occurred');
          done();
        },
      });
    });

    it('Should trigger Error if consumer task failed', (done) => {
      // Given
      expect.assertions(2);
      tracksLegacyBrokerMock.send.mockReset().mockReturnValueOnce(of('ERROR'));

      const configDataMock: Partial<RabbitmqConfig> = {
        requestTimeout: 1,
      };

      configMock.get.mockReset().mockReturnValueOnce(configDataMock);

      // When
      const order$ = service['buildOrder'](
        tracksLegacyBrokerMock as unknown as ClientProxy,
        identityHashMock,
      );

      // Then
      order$.subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          expect(error).toBeInstanceOf(CsmrAggregateTracksCsmrFailedException);
          done();
        },
      });
    });
  });

  describe('getTracksGroup()', () => {
    let buildOrderMock;
    let lastValueMock;
    const orderHighMock = of(tracksHighMock);
    const orderLegacyMock = of(tracksLegacyMock);

    beforeEach(() => {
      buildOrderMock = jest.spyOn<CmsrAggregateTracksBrokerService, any>(
        service,
        'buildOrder',
      );
    });

    it('should create orders from broker connections', async () => {
      // Given
      buildOrderMock
        .mockReturnValueOnce(orderHighMock)
        .mockReturnValueOnce(orderLegacyMock);

      lastValueMock = mocked(lastValueFrom);
      lastValueMock
        .mockReturnValueOnce(tracksHighMock)
        .mockReturnValueOnce(tracksLegacyMock);
      // When
      await service.getTracksGroup(identityHashMock);

      // Then
      expect(buildOrderMock).toHaveBeenCalledTimes(2);
      expect(buildOrderMock).toHaveBeenNthCalledWith(
        1,
        tracksHighBrokerMock,
        identityHashMock,
      );
      expect(buildOrderMock).toHaveBeenNthCalledWith(
        2,
        tracksLegacyBrokerMock,
        identityHashMock,
      );
    });

    it('should subscribe to order of brokers', async () => {
      // Given
      buildOrderMock
        .mockReturnValueOnce(orderHighMock)
        .mockReturnValueOnce(orderLegacyMock);

      lastValueMock = mocked(lastValueFrom);
      lastValueMock
        .mockReturnValueOnce(tracksHighMock)
        .mockReturnValueOnce(tracksLegacyMock);

      // When
      await service.getTracksGroup(identityHashMock);

      // Then
      expect(lastValueFrom).toHaveBeenCalledTimes(2);
      expect(lastValueFrom).toHaveBeenNthCalledWith(1, orderHighMock);
      expect(lastValueFrom).toHaveBeenNthCalledWith(2, orderLegacyMock);
    });

    it('should get tracks from all broker orders', async () => {
      // Given
      buildOrderMock
        .mockReturnValueOnce(orderHighMock)
        .mockReturnValueOnce(orderLegacyMock);

      lastValueMock = mocked(lastValueFrom);
      lastValueMock
        .mockReturnValueOnce(tracksHighMock)
        .mockReturnValueOnce(tracksLegacyMock);

      // When
      const results = await service.getTracksGroup(identityHashMock);

      // Then
      expect(results).toStrictEqual([tracksHighMock, tracksLegacyMock]);
    });

    it('should get tracks from one broker order', async () => {
      // Given
      buildOrderMock.mockReturnValueOnce(orderHighMock).mockReturnValueOnce([]);

      lastValueMock = mocked(lastValueFrom);
      lastValueMock.mockReturnValueOnce(tracksHighMock).mockReturnValueOnce([]);
      // When
      const results = await service.getTracksGroup(identityHashMock);
      // Then
      expect(results).toStrictEqual([tracksHighMock, []]);
    });

    it('should get exception if tracks ordered failed', async () => {
      // Given
      buildOrderMock
        .mockReturnValueOnce(orderHighMock)
        .mockReturnValueOnce(orderLegacyMock);

      const errorMock = new Error('Unknown Error');
      lastValueMock
        .mockReturnValueOnce(tracksHighMock)
        .mockRejectedValueOnce(errorMock);

      // When
      await expect(
        service.getTracksGroup(identityHashMock),
        // Then
      ).rejects.toThrow(errorMock);
    });
  });
});
