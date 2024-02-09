import {
  isHttpHeaders,
  ValidateHttpHeadersConstraint,
  validateSetCookie,
} from './http-headers.validator';

describe('isHttpHeaders()', () => {
  it('should return true if the value is a object with values', () => {
    // setup
    const values = {
      key1: 'key1Value',
      key2: 'key2Value',
    };

    // action
    const result = isHttpHeaders(values);

    // expect
    expect(result).toStrictEqual(true);
  });

  it('should return true if the value is a void object', () => {
    // setup
    const values = {};

    // action
    const result = isHttpHeaders(values);

    // expect
    expect(result).toStrictEqual(true);
  });

  it('should return false if the value is a object with non-ascii value', () => {
    // setup
    const values = {
      key1: '£',
    };

    // action
    const result = isHttpHeaders(values);

    // expect
    expect(result).toStrictEqual(false);
  });

  it('should return false if the value is a object with non-ascii key', () => {
    // setup
    const values = {
      '£': 'pounds',
    };

    // action
    const result = isHttpHeaders(values);

    // expect
    expect(result).toStrictEqual(false);
  });

  describe('special param "set-cookie"', () => {
    it('should return true if set-cookie has ascii value', () => {
      // setup
      const values = {
        test: 'hello world',
        'set-cookie': ['hello', 'world'],
      };

      // action
      const result = isHttpHeaders(values);

      // expect
      expect(result).toStrictEqual(true);
    });
    it('should return false if set-cookie has no-ascii value', () => {
      // setup
      const values = {
        test: 'hello world',
        'set-cookie': ['hello', '£'],
      };

      // action
      const result = isHttpHeaders(values);

      // expect
      expect(result).toStrictEqual(false);
    });
    it('should return false if set-cookie has a wrong type', () => {
      // setup
      const values = {
        test: 'hello world',
        'set-cookie': 42,
      };

      // action
      const result = isHttpHeaders(values);

      // expect
      expect(result).toStrictEqual(false);
    });
  });
});
describe('ValidateHttpHeadersConstraint', () => {
  let instance;

  beforeEach(() => {
    instance = new ValidateHttpHeadersConstraint();
  });

  describe('validate()', () => {
    it('should validate the values', () => {
      // setup
      const values = {
        echo: 'echoValue',
      };

      // action
      const result = instance.validate(values);

      // expect
      expect(result).toBe(true);
    });

    it('should return true if the value is a void object', () => {
      // setup
      const values = {};

      // action
      const result = instance.validate(values);

      // expect
      expect(result).toStrictEqual(true);
    });

    it('should return false if the value is a string', () => {
      // setup
      const values = 'Sarah Connor';

      // action
      const result = instance.validate(values);

      // expect
      expect(result).toStrictEqual(false);
    });
    it('should return false if the value is a number', () => {
      // setup
      const values = 42;

      // action
      const result = instance.validate(values);

      // expect
      expect(result).toStrictEqual(false);
    });
    it('should return false if the value is a object with non-ascii value', () => {
      // setup
      const values = {
        key1: '£',
      };
      // action
      const result = instance.validate(values);

      // expect
      expect(result).toStrictEqual(false);
    });
  });

  describe('defaultMessage()', () => {
    it('should return the default message', () => {
      // setup
      // action
      const result = instance.defaultMessage();

      // expect
      expect(result).toStrictEqual('Please check the HTTP headers values');
    });
  });
});

describe('validateSetCookie', () => {
  describe('should validate a string', () => {
    // When
    const result = validateSetCookie('an acceptable string');

    // Then
    expect(result).toStrictEqual(true);
  });

  describe('should validate an array', () => {
    // When
    const result = validateSetCookie(['an acceptable string', 'in array']);

    // Then
    expect(result).toStrictEqual(true);
  });

  describe('should return false if it is non-ascii', () => {
    // When
    const result = validateSetCookie('£');

    // Then
    expect(result).toStrictEqual(false);
  });
});
