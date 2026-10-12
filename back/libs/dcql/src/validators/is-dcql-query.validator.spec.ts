import { DcqlInvalidQueryException } from '../exceptions';
import { DcqlService } from '../services';
import { IsDcqlQueryConstraint } from './is-dcql-query.validator';

describe('IsDcqlQueryConstraint', () => {
  let constraint: IsDcqlQueryConstraint;

  const dcqlServiceMock = {
    parse: jest.fn(),
  };

  const valueMock = { credentials: [{ id: 'pid-fc', format: 'mso_mdoc' }] };

  beforeEach(() => {
    jest.resetAllMocks();

    constraint = new IsDcqlQueryConstraint(
      dcqlServiceMock as unknown as DcqlService,
    );
  });

  describe('validate', () => {
    it('should parse the value with the dcql service', () => {
      // When
      constraint.validate(valueMock);

      // Then
      expect(dcqlServiceMock.parse).toHaveBeenCalledExactlyOnceWith(valueMock);
    });

    it('should return true when the value is a valid DCQL query', () => {
      // When
      const result = constraint.validate(valueMock);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when the dcql service rejects the value', () => {
      // Given
      dcqlServiceMock.parse.mockImplementation(() => {
        throw new DcqlInvalidQueryException();
      });

      // When
      const result = constraint.validate(valueMock);

      // Then
      expect(result).toBe(false);
    });

    it('should rethrow an unexpected error', () => {
      // Given
      const unexpectedError = new Error('unexpected');
      dcqlServiceMock.parse.mockImplementation(() => {
        throw unexpectedError;
      });

      // When / Then
      expect(() => constraint.validate(valueMock)).toThrow(unexpectedError);
    });
  });

  describe('defaultMessage', () => {
    it('should return the validation error message', () => {
      // When
      const result = constraint.defaultMessage();

      // Then
      expect(result).toBe('The value must be a valid DCQL query');
    });
  });
});
