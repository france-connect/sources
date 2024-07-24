import { Test, TestingModule } from '@nestjs/testing';

import { ExceptionKey, RnippCode, Scenario } from '../enums';
import { MockRnippService } from '../services';

describe('MockRnippService', () => {
  let service: MockRnippService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MockRnippService],
    }).compile();

    service = module.get<MockRnippService>(MockRnippService);
  });

  describe('getExceptionKey', () => {
    it('should return undefined if no exception found in prenoms', () => {
      // Given
      const prenoms = 'test';

      // When / Then
      expect(service.getExceptionKey(prenoms)).toBeUndefined();
    });

    it('should return undefined if exception not fount in exceptionList', () => {
      // Given
      const prenoms = 'test_1';

      // When / Then
      expect(service.getExceptionKey(prenoms)).toBeUndefined();
    });

    it('should return the exception code if found', () => {
      // Given
      const prenoms = 'test_E010004';

      // When / Then
      expect(service.getExceptionKey(prenoms)).toEqual('E010004');
    });
  });

  describe('getRnippCode', () => {
    const codeLieuNaissance = '75020';
    it('should return 2 if exceptionKey is undefined', () => {
      // Given
      const exceptionKey = undefined;

      // When / Then
      expect(service.getRnippCode(codeLieuNaissance, exceptionKey)).toEqual(
        RnippCode.TWO,
      );
    });

    it('should return 7 if exceptionKey is E010007', () => {
      // Given
      const exceptionKey = ExceptionKey.E010007;

      // When / Then
      expect(service.getRnippCode(codeLieuNaissance, exceptionKey)).toEqual(
        RnippCode.SEVEN,
      );
    });

    it('should call handleMultipleCog', () => {
      // Given
      const exceptionKey = ExceptionKey.MULTICOG;
      service['handleMultipleCog'] = jest.fn();

      // When
      service.getRnippCode(codeLieuNaissance, exceptionKey);

      // Then
      expect(service['handleMultipleCog']).toHaveBeenCalledTimes(1);
      expect(service['handleMultipleCog']).toHaveBeenCalledWith(
        exceptionKey,
        codeLieuNaissance,
      );
    });

    it('should return handleMultipleCog result', () => {
      // Given
      const exceptionKey = ExceptionKey.MULTICOG;
      service['handleMultipleCog'] = jest.fn().mockReturnValue(RnippCode.EIGHT);

      // When / Then
      expect(service.getRnippCode(codeLieuNaissance, exceptionKey)).toEqual(
        RnippCode.EIGHT,
      );
    });

    it('should return undefined in default case', () => {
      // Given
      const exceptionKey = ExceptionKey.E010004;

      // When / Then
      expect(service.getRnippCode(codeLieuNaissance, exceptionKey)).toEqual(
        undefined,
      );
    });
  });

  describe('handleMultipleCog', () => {
    it('should return rnippCode.EIGHT if codeLieuNaissance is not 27161', () => {
      // Given
      const exceptionKey = ExceptionKey.MULTICOG;
      const codeLieuNaissance = '75020';

      // When / Then
      expect(
        service['handleMultipleCog'](exceptionKey, codeLieuNaissance),
      ).toEqual(RnippCode.EIGHT);
    });

    it('should return rnippCode.TWO if codeLieuNaissance is 27161 and exceptionKey is MULTICOG', () => {
      // Given
      const exceptionKey = ExceptionKey.MULTICOG;
      const codeLieuNaissance = '27161';

      // When / Then
      expect(
        service['handleMultipleCog'](exceptionKey, codeLieuNaissance),
      ).toEqual(RnippCode.TWO);
    });

    it('should return rnippCode.EIGHT if codeLieuNaissance is 27161 and exceptionKey is MULTICOGERROR', () => {
      // Given
      const exceptionKey = ExceptionKey.MULTICOGERROR;
      const codeLieuNaissance = '27161';

      // When / Then
      expect(
        service['handleMultipleCog'](exceptionKey, codeLieuNaissance),
      ).toEqual(RnippCode.EIGHT);
    });

    it('should return rnippCode.FOUR if codeLieuNaissance is 27161 and exceptionKey is MULTICOGECHO', () => {
      // Given
      const exceptionKey = ExceptionKey.MULTICOGECHO;
      const codeLieuNaissance = '27161';

      // When / Then
      expect(
        service['handleMultipleCog'](exceptionKey, codeLieuNaissance),
      ).toEqual(RnippCode.FOUR);
    });
  });

  describe('getScenario', () => {
    it('should return TIMEOUT if exceptionKey is E010011', () => {
      // Given
      const exceptionKey = ExceptionKey.E010011;

      // When / Then
      expect(service.getScenario(exceptionKey)).toEqual(Scenario.TIMEOUT);
    });

    it('should return success if exceptionKey is undefined', () => {
      // Given
      const exceptionKey = undefined;

      // When / Then
      expect(service.getScenario(exceptionKey)).toEqual(Scenario.SUCCESS);
    });

    it('should return success if exceptionKey is E010007', () => {
      // Given
      const exceptionKey = ExceptionKey.E010007;

      // When / Then
      expect(service.getScenario(exceptionKey)).toEqual(Scenario.SUCCESS);
    });

    it('should return success if exceptionKey is MULTICOG', () => {
      // Given
      const exceptionKey = ExceptionKey.MULTICOG;

      // When / Then
      expect(service.getScenario(exceptionKey)).toEqual(Scenario.SUCCESS);
    });

    it('should return error if the default case ', () => {
      // Given
      const exceptionKey = ExceptionKey.E010004;

      // When / Then
      expect(service.getScenario(exceptionKey)).toEqual(Scenario.ERROR);
    });
  });

  describe('formatDate', () => {
    it('should format empty date', () => {
      // Given
      const date = '';

      // When / Then
      expect(service.formatDate(date)).toEqual('');
    });
    it('should format full date', () => {
      // Given
      const date = '19950308';

      // When / Then
      expect(service.formatDate(date)).toEqual('1995-03-08');
    });

    it('should format date without day', () => {
      // Given
      const date = '19950300';

      // When / Then
      expect(service.formatDate(date)).toEqual('1995-03');
    });

    it('should format date without month and day', () => {
      // Given
      const date = '19950000';

      // When / Then
      expect(service.formatDate(date)).toEqual('1995');
    });
  });

  describe('formatName', () => {
    it('should format empty name', () => {
      // Given
      const name = '';

      // When / Then
      expect(service.formatName(name)).toEqual(['']);
    });
    it('should format single name', () => {
      // Given
      const name = 'name1';

      // When / Then
      expect(service.formatName(name)).toEqual(['name1']);
    });

    it('should format several names', () => {
      // Given
      const name = 'name1 name2';

      // When / Then
      expect(service.formatName(name)).toEqual(['name1', 'name2']);
    });
  });
});
