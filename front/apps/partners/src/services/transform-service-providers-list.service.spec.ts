import { t } from '@fc/i18n';

import { transformServiceProvidersList } from './transform-service-providers-list.service';

jest.mock('@fc/i18n');

describe('transformServiceProvidersList', () => {
  // given
  const serviceProviderMock = {
    meta: {
      permissions: ['SERVICE_PROVIDER_EDIT'],
      urls: {
        edit: '/edit',
        view: '/view',
      },
    },
    payload: {
      createdAt: '2022-02-21T23:00:00.000Z',
      datapasses: [{ remoteId: 123456 }],
      id: '987654',
      name: 'name',
      organisation: { name: 'organisationName' },
      platform: { name: 'platform' },
      status: 'status',
      updatedAt: '2022-05-01T22:00:00.000Z',
    },
    type: 'SERVICE_PROVIDER',
  };

  it('should throw an Error if createdAt is not a valid datetime', () => {
    // given
    const createdAt = null as unknown as string;

    // when
    expect(() => {
      transformServiceProvidersList({
        ...serviceProviderMock,
        payload: {
          ...serviceProviderMock.payload,
          createdAt,
        },
      });

      // then
    }).toThrow('Unable to parse service provider payload item');
  });

  it('should not throw an Error if createdAt is a valid datetime', () => {
    // given
    const createdAt = '2022-07-29T14:41:26.437Z';

    // when
    expect(() => {
      transformServiceProvidersList({
        ...serviceProviderMock,
        payload: {
          ...serviceProviderMock.payload,
          createdAt,
        },
      });

      // then
    }).not.toThrow('Unable to parse service provider payload item');
  });

  it('should return a ServiceProviderItem object', () => {
    // given
    const expected = {
      color: undefined,
      createdAt: 'chaine traduite',
      datapassId: 'chaine traduite',
      id: '987654',
      organisationName: 'organisationName',
      platformName: 'chaine traduite',
      spName: 'name',
      status: 'chaine traduite',
      url: '/edit',
    };

    // when
    jest.mocked(t).mockReturnValue('chaine traduite');
    const result = transformServiceProvidersList({
      ...serviceProviderMock,
    });

    // then
    expect(result).toStrictEqual(expected);
  });

  it('should return a ServiceProviderItem object with empty datapass if no datapasses was provided', () => {
    // given
    const expected = {
      color: undefined,
      createdAt: 'chaine traduite',
      datapassId: '',
      id: '987654',
      organisationName: 'organisationName',
      platformName: 'chaine traduite',
      spName: 'name',
      status: 'chaine traduite',
      url: '/edit',
    };

    jest.mocked(t).mockReturnValue('chaine traduite');

    // when
    const result = transformServiceProvidersList({
      ...serviceProviderMock,
      payload: {
        ...serviceProviderMock.payload,
        datapasses: [],
      },
    });

    // then
    expect(result).toStrictEqual(expected);
  });

  it('should return an objetct with url = /edit when permissions includes SERVICE_PROVIDER_EDIT', () => {
    // when
    const result = transformServiceProvidersList(serviceProviderMock);

    // then
    expect(result).toEqual(expect.objectContaining({ url: '/edit' }));
  });

  it('should return an objetct with url = /view when permissions includes SERVICE_PROVIDER_VIEW', () => {
    // when
    const result = transformServiceProvidersList({
      ...serviceProviderMock,
      meta: {
        ...serviceProviderMock.meta,
        permissions: ['SERVICE_PROVIDER_VIEW'],
      },
    });

    // then
    expect(result).toEqual(expect.objectContaining({ url: '/view' }));
  });

  it('should return an objetct with url = /edit when permissions includes SERVICE_PROVIDER_VIEW and SERVICE_PROVIDER_EDIT', () => {
    // when
    const result = transformServiceProvidersList({
      ...serviceProviderMock,
      meta: {
        ...serviceProviderMock.meta,
        permissions: ['SERVICE_PROVIDER_VIEW', 'SERVICE_PROVIDER_EDIT'],
      },
    });

    // then
    expect(result).toEqual(expect.objectContaining({ url: '/edit' }));
  });
});
