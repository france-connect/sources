import { Test, TestingModule } from '@nestjs/testing';

import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpTrackingService } from './core-fcp-tracking.service';

jest.mock('@fc/tracking-context', () => ({
  extractNetworkInfoFromHeaders: jest.fn(),
}));

describe('CoreTrackingService', () => {
  let service: CoreFcpTrackingService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const sessionServiceMock = getSessionServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreFcpTrackingService, SessionService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    service = module.get<CoreFcpTrackingService>(CoreFcpTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractContext()', () => {
    it('should extract specific context property fqdn from fca context', () => {
      // Given
      const trackedEventContextMock = {
        rep_scope: ['rep_scope1', 'rep_scope2'],
      };

      // Then
      expect(
        service['extractContext'](trackedEventContextMock).rep_scope,
      ).toEqual('rep_scope1 rep_scope2');
    });

    it('should not extract other non recognized properties from context', () => {
      // Given
      const trackedEventContextMock = {
        rep_scope: ['rep_scope1', 'rep_scope2'],
        nonRecognizeProperty: 'nonRecognizeProperty',
      };

      // Then
      expect(service['extractContext'](trackedEventContextMock)).toEqual({
        rep_scope: 'rep_scope1 rep_scope2',
      });
    });

    it('should continue to extract other common recognized properties from context', () => {
      // Given
      const trackedEventContextMock = {
        rep_scope: ['rep_scope1', 'rep_scope2'],
        nonRecognizeProperty: 'nonRecognizeProperty',
        claims: ['openId', 'email'],
      };

      // Then
      expect(service['extractContext'](trackedEventContextMock)).toEqual({
        rep_scope: 'rep_scope1 rep_scope2',
        claims: ['openId', 'email'],
      });
    });
  });
});
