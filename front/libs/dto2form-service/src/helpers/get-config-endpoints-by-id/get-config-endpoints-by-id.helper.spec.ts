import type { Dto2FormConfigInterface } from '@fc/dto2form';

import { getConfigEndpointsByIdHelper } from './get-config-endpoints-by-id.helper';

describe('getConfigEndpointsByIdHelper', () => {
  // Given
  const configMock = {
    configWithEndpoints: {
      endpoints: Symbol('any-config-with-endpoints'),
    },
    configWithNullEndpoints: {
      endpoints: null,
    },
  } as unknown as Dto2FormConfigInterface;

  it('should return the form', () => {
    // When
    const result = getConfigEndpointsByIdHelper('configWithEndpoints', configMock);

    // Then
    expect(result).toStrictEqual(configMock.configWithEndpoints.endpoints);
  });

  it('should throw if endpoints are falsey', () => {
    // Then
    expect(() => {
      getConfigEndpointsByIdHelper('acme-config-id', configMock);
    }).toThrow('Endpoints for id "acme-config-id" not found in configuration.');
  });

  it('should throw if the id do not match', () => {
    // Then
    expect(() => {
      getConfigEndpointsByIdHelper('configWithNullEndpoints', configMock);
    }).toThrow('Endpoints for id "configWithNullEndpoints" not found in configuration.');
  });
});
