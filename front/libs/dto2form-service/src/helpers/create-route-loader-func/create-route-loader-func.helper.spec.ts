import { generatePath, type LoaderFunctionArgs } from 'react-router';

import { HttpMethods } from '@fc/common';
import { fetchWithAuthHandling } from '@fc/http-client';

import { createDTO2FormRouteLoaderFunc } from './create-route-loader-func.helper';

describe('createRouteLoaderFunction', () => {
  // Given
  const schemaMock = Symbol('any-acme-schema');

  const schemaEndpointMock = { method: HttpMethods.GET, path: 'any-acme-schema-path' };
  const submitEndpointMock = { method: HttpMethods.POST, path: 'any-acme-submit-path' };

  const mockEndpointsWithoutLoad = {
    schema: schemaEndpointMock,
    submit: submitEndpointMock,
  };

  const mockParams = { any: 'any-acme-params' };
  const loaderFunctionArgsMock = { params: mockParams } as unknown as LoaderFunctionArgs;

  it('should return an instance of LoaderFunction', () => {
    // When
    const loaderFunction = createDTO2FormRouteLoaderFunc(mockEndpointsWithoutLoad);

    // Then
    expect(loaderFunction).toBeInstanceOf(Function);
  });

  describe('LoaderFunction when load is undefined', () => {
    it('should call generatePath with params', async () => {
      // When
      const loaderFunction = createDTO2FormRouteLoaderFunc(mockEndpointsWithoutLoad);
      await loaderFunction(loaderFunctionArgsMock);

      // Then
      expect(generatePath).toHaveBeenCalledExactlyOnceWith(schemaEndpointMock.path, mockParams);
    });

    it('should call dto2FormServiceGet with params', async () => {
      // Given
      jest.mocked(generatePath).mockReturnValueOnce(schemaEndpointMock.path);

      // When
      const loaderFunction = createDTO2FormRouteLoaderFunc(mockEndpointsWithoutLoad);
      await loaderFunction(loaderFunctionArgsMock);

      // Then
      expect(fetchWithAuthHandling).toHaveBeenCalledExactlyOnceWith(schemaEndpointMock.path);
    });

    it('should return data and schema', async () => {
      // Given
      jest.mocked(fetchWithAuthHandling).mockResolvedValueOnce(schemaMock);

      // When
      const loaderFunction = createDTO2FormRouteLoaderFunc(mockEndpointsWithoutLoad);
      const result = await loaderFunction(loaderFunctionArgsMock);

      // Then
      expect(result).toStrictEqual({ data: null, schema: schemaMock });
    });
  });

  describe('LoaderFunction when load is defined', () => {
    // Given
    const loadEndpointMock = { method: HttpMethods.GET, path: 'any-acme-load-path' };

    const mockEndpointsWithLoad = {
      ...mockEndpointsWithoutLoad,
      load: loadEndpointMock,
    };

    it('should call generatePath with params', async () => {
      // When
      const loaderFunction = createDTO2FormRouteLoaderFunc(mockEndpointsWithLoad);
      await loaderFunction(loaderFunctionArgsMock);

      // Then
      expect(generatePath).toHaveBeenCalledTimes(2);
      expect(generatePath).toHaveBeenNthCalledWith(1, schemaEndpointMock.path, mockParams);
      expect(generatePath).toHaveBeenNthCalledWith(2, loadEndpointMock.path, mockParams);
    });

    it('should call dto2FormServiceGet with params', async () => {
      // Given
      jest
        .mocked(generatePath)
        .mockReturnValueOnce(schemaEndpointMock.path)
        .mockReturnValueOnce(loadEndpointMock.path);

      // When
      const loaderFunction = createDTO2FormRouteLoaderFunc(mockEndpointsWithLoad);
      await loaderFunction(loaderFunctionArgsMock);

      // Then
      expect(fetchWithAuthHandling).toHaveBeenCalledTimes(2);
      expect(fetchWithAuthHandling).toHaveBeenNthCalledWith(1, schemaEndpointMock.path);
      expect(fetchWithAuthHandling).toHaveBeenNthCalledWith(2, loadEndpointMock.path);
    });

    it('should return data and schema', async () => {
      // Given
      const dataMock = Symbol('any-acme-data');
      jest
        .mocked(fetchWithAuthHandling)
        .mockResolvedValueOnce(schemaMock)
        .mockResolvedValueOnce(dataMock);

      // When
      const loaderFunction = createDTO2FormRouteLoaderFunc(mockEndpointsWithLoad);
      const result = await loaderFunction(loaderFunctionArgsMock);

      // Then
      expect(result).toStrictEqual({ data: dataMock, schema: schemaMock });
    });
  });
});
