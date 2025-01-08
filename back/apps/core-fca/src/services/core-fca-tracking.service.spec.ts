import { Test, TestingModule } from '@nestjs/testing';

import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { CoreFcaTrackingService } from './core-fca-tracking.service';

jest.mock('@fc/tracking-context', () => ({
  extractNetworkInfoFromHeaders: jest.fn(),
}));

describe('CoreTrackingService', () => {
  let service: CoreFcaTrackingService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const sessionServiceMock = getSessionServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreFcaTrackingService, SessionService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    service = module.get<CoreFcaTrackingService>(CoreFcaTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractContext()', () => {
    it('should extract specific context property fqdn from fca context', () => {
      // Given
      const trackedEventContextMock = {
        fqdn: 'hogwarts@uk',
      };

      // Then
      expect(service['extractContext'](trackedEventContextMock).fqdn).toEqual(
        'hogwarts@uk',
      );
    });

    it('should not extract other non recognized properties from context', () => {
      // Given
      const trackedEventContextMock = {
        fqdn: 'hogwarts@uk',
        nonRecognizeProperty: 'nonRecognizeProperty',
      };

      // Then
      expect(service['extractContext'](trackedEventContextMock)).toEqual({
        fqdn: 'hogwarts@uk',
      });
    });

    it('should continue to extract other common recognized properties from context', () => {
      // Given
      const trackedEventContextMock = {
        fqdn: 'hogwarts@uk',
        nonRecognizeProperty: 'nonRecognizeProperty',
        claims: ['openId', 'email'],
      };

      // Then
      expect(service['extractContext'](trackedEventContextMock)).toEqual({
        fqdn: 'hogwarts@uk',
        claims: ['openId', 'email'],
      });
    });
  });
});
