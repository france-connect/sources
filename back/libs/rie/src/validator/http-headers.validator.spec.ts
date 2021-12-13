import {
  isHttpHeaders,
  ValidateHttpHeadersConstraint,
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

    it('should return false if the value is a object with value too big', () => {
      // setup
      const values = {
        key1: '4c17daafc55b1e3c28848d176b8b940029b33180efc588fbf1e5b624cdb09ae1e28e7ff7225d380268fe43eaed9000af42f4f6c32c76d682351618f2c77cb94926be2f2cf1484e13ce1e9f75d8bcc90c61dfaf2a48e53892f6c0903188f626119dc879ca9ff72c8f4a372982afeb0f34c4d04028e0190144e57933f6009d69063121e45496adc82f6459c5f9d822867ed81916fe7ea2b1b0bf4af11c20b28c9a688155335fcd9dbd3f186a2a6813447b2bff854aa5d4f5424a1d98112f5d155a3b616b4436458229d99bc99e62cb643e9c44b0ad0185da73b70b48a466c73091c43e7c64425c28be61ddab049219dc9726da8d9eebf010aceef53df5218831fcfe486f1c137fab404bbc31773ca7d04ac52fa878c2102f6b581fab3f3016cb47248f61b8fc78ca0dd161764d6ee03b37ac6ba3b549918d6fd5a7b3d22c5a95ca654a18c7bf02b377d407dca9990a251d6f28e5407fde0722d466ecd61ade70a03bb86e3d6c6cf4b1fa9879cc6b638c94db5b6d02b9ed857714815fe42ee7e0ffbd3e630ccd349dd24fdc298fb43d2b3f65fd3cc0daa48b6fb513dc95fd9b72bd1568ec8356085444ae0cdd139fda6a2902a1845ab482ac691675dd43261eed0d9fa2f6c506577c907b9a9921c9a84ad958ce036255fee9ae55e109ff54666990bc945c805202fd4d32bcbcb44469c93a6fb85946fa27b1c3c9e28a0f298a5b8d9',
      };

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
