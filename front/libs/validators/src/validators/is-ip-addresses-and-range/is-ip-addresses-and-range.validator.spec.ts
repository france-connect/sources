import { isIP, isIPRange } from 'validator';

import { isIpAddressesAndRange } from './is-ip-addresses-and-range.validator';

describe('isIpAddressesAndRange', () => {
  it('should call isIP with value', () => {
    // Given
    const value = 'any-ip-address-value';
    const resultMock = Symbol('is-ip-mock') as unknown as boolean;

    jest.mocked(isIP).mockReturnValueOnce(resultMock);

    // When
    const result = isIpAddressesAndRange(value);

    // Then
    expect(result).toBe(resultMock);
    expect(isIP).toHaveBeenCalledOnce();
    expect(isIP).toHaveBeenCalledWith(value);
  });

  it('should call isIPRange with value when isIP returns false', () => {
    // Given
    const value = 'any-ip-range-value';
    const resultMock = Symbol('is-ip-range-mock') as unknown as boolean;

    jest.mocked(isIP).mockReturnValueOnce(false);
    jest.mocked(isIPRange).mockReturnValueOnce(resultMock);

    // When
    const result = isIpAddressesAndRange(value);

    // Then
    expect(result).toBe(resultMock);
    expect(isIPRange).toHaveBeenCalledOnce();
    expect(isIPRange).toHaveBeenCalledWith(value);
  });
});
