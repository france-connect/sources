import { loadData } from '@fc/dto2form';

import { loadVersion } from './load-version.helper';

jest.mock('@fc/dto2form', () => ({
  loadData: jest.fn(),
}));

describe('loadVersion', () => {
  const mockData = { version: '1.0.0' };
  const mockEndpoint = '/api-version-mock';
  const loaderFunctionMock = jest.fn();

  beforeEach(() => {
    jest.mocked(loadData).mockReturnValue(loaderFunctionMock);
  });

  it('should return data from the first version', async () => {
    // Given
    const responseMock = {
      payload: {
        versions: [
          {
            data: {
              version: '1.0.0',
            },
          },
        ],
      },
    };
    loaderFunctionMock.mockResolvedValue(responseMock);

    // When
    const result = await loadVersion(mockEndpoint)({ params: {} } as never);

    // Then
    expect(result).toEqual(mockData);
  });

  it('should return undefined if data does not exists', async () => {
    // Given
    const responseMock = {};
    loaderFunctionMock.mockResolvedValue(responseMock);

    // When
    const result = await loadVersion(mockEndpoint)({ params: {} } as never);

    // Then
    expect(result).toBeUndefined();
  });
});
