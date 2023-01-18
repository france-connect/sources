import { t } from '@fc/i18n';

import { transformServiceProvider } from './transform-service-provider.service';

describe('transformServiceProvider', () => {
  // given
  const serviceProviderItemMock = {
    createdAt: '2022-02-21T23:00:00.000Z',
    datapasses: [{ remoteId: 42 }],
    id: 'd7d36b8',
    name: 'name',
    organisation: { name: 'organisationName' },
    platform: { name: 'platform' },
    status: 'status',
  };

  it('should return a ServiceProviderItem object', () => {
    // given
    const expectedResult = {
      color: undefined,
      platformName: 'chaine traduite',
      spName: 'name',
      status: 'chaine traduite',
    };

    jest.mocked(t).mockReturnValue('chaine traduite');

    // when
    const result = transformServiceProvider(serviceProviderItemMock);

    // then
    expect(result).toStrictEqual(expectedResult);
  });

  it('should throw an error if status is undefined', () => {
    // given
    const item = { ...serviceProviderItemMock, status: undefined as unknown as string };

    // when
    expect(() => {
      transformServiceProvider(item);

      // then
    }).toThrow(
      'Unable to parse service provider payload item : status, platformName or name is undefined',
    );
  });

  it('should throw an error if name is undefined', () => {
    // given
    const item = { ...serviceProviderItemMock, name: undefined as unknown as string };

    // when
    expect(() => {
      transformServiceProvider(item);

      // then
    }).toThrow(
      'Unable to parse service provider payload item : status, platformName or name is undefined',
    );
  });

  it('should throw an error if platformName is undefined', () => {
    // given
    const item = {
      ...serviceProviderItemMock,
      platform: {
        name: undefined as unknown as string,
      },
    };

    // when
    expect(() => {
      transformServiceProvider(item);

      // then
    }).toThrow(
      'Unable to parse service provider payload item : status, platformName or name is undefined',
    );
  });

  it('should throw an error if t throw string', () => {
    // given
    jest.mocked(t).mockImplementationOnce(() => {
      throw undefined as unknown as Error;
    });

    // when
    expect(() => {
      transformServiceProvider(serviceProviderItemMock);

      // then
    }).toThrow('Unable to parse service provider payload item ');
  });
});
