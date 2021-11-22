import { isNotValidFeatureHandlerKey } from './is-not-valid-feature-handler-key.util';

describe('isNotValidFeatureHandlerKey', () => {
  it('should return false if it contains string value', () => {
    const valueMock = 'sarah';
    const result = isNotValidFeatureHandlerKey(valueMock);
    expect(result).toStrictEqual(false);
  });

  it('should return false if it contains null value', () => {
    const valueMock = null;
    const result = isNotValidFeatureHandlerKey(valueMock);
    expect(result).toStrictEqual(false);
  });

  it('should return true if it contains undefined value', () => {
    const valueMock = undefined;
    const result = isNotValidFeatureHandlerKey(valueMock);
    expect(result).toStrictEqual(true);
  });

  it('should return true if it contains empty string value', () => {
    const valueMock = '';
    const result = isNotValidFeatureHandlerKey(valueMock);
    expect(result).toStrictEqual(true);
  });

  it('should return true if it contains boolean value', () => {
    const valueMock = true;
    const result = isNotValidFeatureHandlerKey(valueMock);
    expect(result).toStrictEqual(true);
  });

  it('should return true if it contains a number', () => {
    const valueMock = 42;
    const result = isNotValidFeatureHandlerKey(valueMock);
    expect(result).toStrictEqual(true);
  });

  it('should return true if it contains an object', () => {
    const valueMock = {};
    const result = isNotValidFeatureHandlerKey(valueMock);
    expect(result).toStrictEqual(true);
  });
});
