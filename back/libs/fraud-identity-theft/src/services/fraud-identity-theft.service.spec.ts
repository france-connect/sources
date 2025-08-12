import { Test, TestingModule } from '@nestjs/testing';

import { FraudIdentitySessionDto } from '../dto';
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
    it('should build a FraudCaseDto', () => {
      // Given
      const fraudCaseSession = {
        connection: { code: '12345' },
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
      });
    });

    it('should generate unique fraud case IDs', () => {
      // Given
      const fraudCaseSession = {
        connection: { code: '12345' },
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
});
