import { Test, TestingModule } from '@nestjs/testing';

import { FraudTrackDto, SanitizedTrackDto } from '@fc/csmr-fraud-client';

import {
  FraudConnectionSessionDto,
  FraudContactFormDto,
  FraudDescriptionSessionDto,
  FraudIdentitySessionDto,
} from '../dto';
import { FraudIdentityTheftService } from './fraud-identity-theft.service';

describe('FraudIdentityTheftService', () => {
  let service: FraudIdentityTheftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FraudIdentityTheftService],
    }).compile();

    service = module.get<FraudIdentityTheftService>(FraudIdentityTheftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transformToPivotIdentity', () => {
    it('should transform FraudIdentitySessionDto to PivotIdentityDto', () => {
      // Given
      const identity: FraudIdentitySessionDto = {
        given_name: 'John',
        family_name: 'Doe',
        rawBirthdate: '01/01/1988',
        rawBirthplace: 'Melun',
        rawBirthcountry: 'France',
      };
      const expected = {
        given_name: 'John',
        family_name: 'Doe',
        birthdate: '01/01/1988',
        birthplace: 'Melun',
        birthcountry: 'France',
        gender: '',
      };

      // When
      const result = service.transformToPivotIdentity(identity);

      // Then
      expect(result).toEqual(expected);
    });
  });

  describe('buildFraudCase', () => {
    const fraudTrackMock = Symbol('fraudTrackMock') as unknown as FraudTrackDto;

    it('should build a FraudCaseDto', () => {
      // Given
      const fraudCaseSession = {
        connection: { code: '12345' },
        fraudTracks: [fraudTrackMock],
        contact: { email: 'test@example.com', phone: '+33123456789' },
        description: { description: 'Fraud case description' },
      };

      // When
      const result = service.buildFraudCase(fraudCaseSession);

      // Then
      expect(result).toEqual({
        id: expect.any(String),
        authenticationEventId: '12345',
        contactEmail: 'test@example.com',
        phoneNumber: '+33123456789',
        comment: 'Fraud case description',
        fraudSurveyOrigin: 'identite-inconnue',
        idpEmail: 'test@example.com',
        fraudTracks: [fraudTrackMock],
      });
    });

    it('should generate unique fraud case IDs', () => {
      // Given
      const fraudCaseSession = {
        connection: { code: '12345' },
        fraudTracks: [fraudTrackMock],
        contact: { email: 'test@example.com', phone: '+33123456789' },
        description: { description: 'Fraud case description' },
      };

      // When
      const result1 = service.buildFraudCase(fraudCaseSession);
      const result2 = service.buildFraudCase(fraudCaseSession);

      // Then
      expect(result1.id).not.toEqual(result2.id);
    });
  });

  describe('sanitizeFraudTracks', () => {
    const timeMock = 1664661600000;
    const readableDateMock = '02/10/2022 00:00:00';

    const fraudTrack: FraudTrackDto = {
      id: 'idMock',
      platform: 'FranceConnect',
      city: 'Paris',
      country: 'FR',
      idpName: 'idpNameMock',
      idpLabel: 'idpLabelMock',
      idpId: 'idpIdMock',
      spName: 'spNameMock',
      spId: 'spIdMock',
      time: timeMock,
      date: readableDateMock,
      accountId: 'accountIdMock',
      interactionAcr: 'interactionAcrMock',
      interactionId: 'interactionIdMock',
      browsingSessionId: 'browsingSessionIdMock',
      spSub: 'spSubMock',
      idpSub: 'idpSubMock',
      ipAddress: ['ipAddressMock'],
    };

    const sanitizedTrackMock: SanitizedTrackDto = {
      trackId: 'idMock',
      time: timeMock,
      idpLabel: 'idpLabelMock',
      spLabel: 'spNameMock',
      platform: 'FranceConnect',
      interactionAcr: 'interactionAcrMock',
      authenticationEventId: 'browsingSessionIdMock',
    };

    it('should return sanitized tracks', () => {
      // When
      const sanitizedTracks = service.sanitizeFraudTracks([fraudTrack]);

      // Then
      expect(sanitizedTracks).toEqual([sanitizedTrackMock]);
    });
  });

  describe('buildFraudSummary', () => {
    // Given
    const identityMock = Symbol(
      'identityMock',
    ) as unknown as FraudIdentitySessionDto;
    const descriptionMock = Symbol(
      'descriptionMock',
    ) as unknown as FraudDescriptionSessionDto;
    const connectionMock = Symbol(
      'connectionMock',
    ) as unknown as FraudConnectionSessionDto;
    const contactMock = Symbol('contactMock') as unknown as FraudContactFormDto;
    const fraudTrackMock = Symbol('fraudTrackMock') as unknown as FraudTrackDto;
    const sessionMock = {
      description: descriptionMock,
      connection: connectionMock,
      fraudTracks: [fraudTrackMock],
      identity: identityMock,
      contact: contactMock,
    };
    const sanitizedTrackMock = Symbol(
      'sanitizedTrackMock',
    ) as unknown as SanitizedTrackDto;

    beforeEach(() => {
      service['sanitizeFraudTracks'] = jest
        .fn()
        .mockReturnValue([sanitizedTrackMock]);
    });

    it('should call sanitizeFraudTracks', () => {
      // When
      service.buildFraudSummary(sessionMock);

      // Then
      expect(service['sanitizeFraudTracks']).toHaveBeenCalledExactlyOnceWith([
        fraudTrackMock,
      ]);
    });

    it('should build a summary with sanitized fraud tracks', () => {
      // When
      const result = service.buildFraudSummary(sessionMock);

      // Then
      expect(result).toEqual({
        description: descriptionMock,
        connection: connectionMock,
        fraudTracks: [sanitizedTrackMock],
        identity: identityMock,
        contact: contactMock,
      });
    });
  });
});
