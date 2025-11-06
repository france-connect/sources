import type { Dto2FormConfigInterface } from '@fc/dto2form';

import { getConfigFormByIdHelper } from './get-config-form-by-id.helper';

describe('getConfigFormByIdHelper', () => {
  // Given
  const configMock = {
    anyConfigWithForm: {
      form: Symbol('any-config-with-form'),
    },
    anyConfigWithFormFalsy: {
      form: null,
    },
  } as unknown as Dto2FormConfigInterface;

  it('should return the form', () => {
    // When
    const result = getConfigFormByIdHelper('anyConfigWithForm', configMock);

    // Then
    expect(result).toStrictEqual(configMock.anyConfigWithForm.form);
  });

  it('should throw if form is falsy', () => {
    // Then
    expect(() => {
      getConfigFormByIdHelper('anyConfigWithFormFalsy', configMock);
    }).toThrow('Form config with id "anyConfigWithFormFalsy" not found.');
  });

  it('should throw if the id do not exist', () => {
    // Then
    expect(() => {
      getConfigFormByIdHelper('acme-config-id', configMock);
    }).toThrow('Form config with id "acme-config-id" not found.');
  });
});
