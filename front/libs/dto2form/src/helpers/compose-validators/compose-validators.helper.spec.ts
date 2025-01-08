import type { FieldState } from 'final-form';

import { composeValidators } from './compose-validators.helper';

describe('composeValidators', () => {
  it('should call all the validators', () => {
    // Given
    const valueMock = Symbol('value mock') as unknown as string;
    const allValuesMock = Symbol('allValues mock') as unknown as object;
    const metaMock = Symbol('meta mock') as unknown as FieldState<string>;

    const validatorMock1 = jest.fn();
    const validatorMock2 = jest.fn();

    // When
    const validators = composeValidators(validatorMock1, validatorMock2);
    validators(valueMock, allValuesMock, metaMock);

    // Then
    expect(validatorMock1).toHaveBeenCalledOnce();
    expect(validatorMock1).toHaveBeenCalledWith(valueMock, allValuesMock, metaMock);
    expect(validatorMock2).toHaveBeenCalledOnce();
    expect(validatorMock2).toHaveBeenCalledWith(valueMock, allValuesMock, metaMock);
  });

  it('should return undefined when all validators pass', () => {
    // Given
    const valueMock = Symbol('value mock') as unknown as string;
    const validatorMock1 = jest.fn().mockReturnValueOnce(undefined);

    // When
    const validators = composeValidators(validatorMock1);
    const result = validators(valueMock, {}, undefined);

    // Then
    expect(result).toBeUndefined();
  });

  it('should return an error message on first validator fail', () => {
    // Given
    const valueMock = Symbol('value mock') as unknown as string;
    const validatorsStackMock = [
      jest.fn(() => undefined),
      jest.fn(() => 'error message mock'),
      jest.fn(() => undefined),
    ];

    // When
    const validators = composeValidators(...validatorsStackMock);
    const result = validators(valueMock, {}, undefined);

    // Then
    expect(result).toBe('error message mock');
    expect(validatorsStackMock[0]).toHaveBeenCalledOnce();
    expect(validatorsStackMock[1]).toHaveBeenCalledOnce();
    expect(validatorsStackMock[2]).not.toHaveBeenCalled();
  });
});
