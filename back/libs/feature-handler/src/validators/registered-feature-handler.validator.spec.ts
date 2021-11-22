import { FeatureHandler } from '../decorators';
import { IsRegisteredFeatureHandlerConstraint } from './registered-feature-handler.validator';

describe('IsRegisteredFeatureHandler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('IsRegisteredFeatureHandlerConstraint', () => {
    it('should return false if input is null', () => {
      // Given
      const input = null;
      const validator = new IsRegisteredFeatureHandlerConstraint();
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toStrictEqual(false);
    });

    it('should return false if input is undefined', () => {
      // Given
      const input = undefined;
      const validator = new IsRegisteredFeatureHandlerConstraint();
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toStrictEqual(false);
    });

    it('should return false if input is a string', () => {
      // Given
      const input = 'some String' as unknown as any;
      const validator = new IsRegisteredFeatureHandlerConstraint();
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toStrictEqual(false);
    });

    it('should return false if input is a number', () => {
      // Given
      const input = 42 as unknown as any;
      const validator = new IsRegisteredFeatureHandlerConstraint();
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toStrictEqual(false);
    });

    it('should return true if input is an object with registred handler', () => {
      // Given
      const registredHandler = 'myRegistredHandler';
      const askedHandler = registredHandler;
      jest
        .spyOn(FeatureHandler, 'getAll')
        .mockImplementationOnce(() => [registredHandler]);

      const input = { bar: askedHandler };
      const validator = new IsRegisteredFeatureHandlerConstraint();
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toStrictEqual(true);
    });

    it('should return false if input is an object without registred handler', () => {
      // Given
      const registredHandler = 'myRegistredHandler';
      const askedHandler = 'anotherHandler';
      jest
        .spyOn(FeatureHandler, 'getAll')
        .mockImplementationOnce(() => [registredHandler]);

      const input = { bar: askedHandler };
      const validator = new IsRegisteredFeatureHandlerConstraint();
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toStrictEqual(false);
    });

    it("should return false if one of the feature handlers in inputs doesn't exist", () => {
      // Given
      const registredHandler = 'one';
      const askedHandler = 'one';
      jest
        .spyOn(FeatureHandler, 'getAll')
        .mockImplementationOnce(() => [registredHandler, 'two']);

      const input = { bar: askedHandler, foo: 'three' };
      const validator = new IsRegisteredFeatureHandlerConstraint();
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toStrictEqual(false);
    });

    it('should return true if all of the feature handlers in inputs exist', () => {
      // Given
      jest
        .spyOn(FeatureHandler, 'getAll')
        .mockImplementationOnce(() => ['one', 'two', 'three']);

      const input = { bar: 'one', foo: 'three' };
      const validator = new IsRegisteredFeatureHandlerConstraint();
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toStrictEqual(true);
    });

    it('should return true even if a process handler is null', () => {
      // Given
      jest
        .spyOn(FeatureHandler, 'getAll')
        .mockImplementationOnce(() => ['one', 'two', 'three']);

      const input = { bar: 'one', foo: null };
      const validator = new IsRegisteredFeatureHandlerConstraint();
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toStrictEqual(true);
    });

    it('should return false if handler values contains empties values', () => {
      // Given
      jest
        .spyOn(FeatureHandler, 'getAll')
        .mockImplementationOnce(() => ['one']);

      const input = { bar: 'one', foo: undefined };
      const validator = new IsRegisteredFeatureHandlerConstraint();
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toStrictEqual(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return error message', () => {
      // Given
      jest
        .spyOn(FeatureHandler, 'getAll')
        .mockImplementationOnce(() => ['sarah', 'connor']);

      const validator = new IsRegisteredFeatureHandlerConstraint();

      // When
      const result = validator.defaultMessage();

      // Then
      expect(result).toEqual('property should be in [sarah,connor]');
    });
  });
});
