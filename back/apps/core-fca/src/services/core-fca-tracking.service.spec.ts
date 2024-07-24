import { Test, TestingModule } from '@nestjs/testing';

import { CoreTrackingService } from '@fc/core';
import { TrackedEventInterface } from '@fc/tracking';

import { CoreFcaTrackingService } from './core-fca-tracking.service';

jest.mock('@fc/tracking-context');
jest.mock('@fc/core');

describe('CoreFcaTrackingService', () => {
  let service: CoreFcaTrackingService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreFcaTrackingService, CoreTrackingService],
    }).compile();

    service = module.get(CoreFcaTrackingService);
  });
  describe('buildLog', () => {
    it('should return a fca track object', async () => {
      // Given
      const trackedEventMock: TrackedEventInterface = {
        category: 'categoryMockedValue',
        event: 'eventMockedValue',
      };

      const contextMock = {
        fqdn: 'hogwarts.uk',
      };

      // When
      const result = await service.buildLog(trackedEventMock, contextMock);

      // Then
      expect(result).toEqual({ fqdn: 'hogwarts.uk' });
    });
  });
});
