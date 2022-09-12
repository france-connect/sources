import { mocked } from 'jest-mock';

import { t } from '@fc/i18n';

import { transformServiceProvider } from './transform-service-provider.service';

jest.mock('@fc/i18n');

describe('transformServiceProvider', () => {
  // given
  const serviceProviderMock = {
    createdAt: '2022-02-21T23:00:00.000Z',
    datapasses: [{ remoteId: 123456 }],
    id: '987654',
    name: 'name',
    organisation: { name: 'organisationName' },
    platform: { name: 'platform' },
    status: 'status',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an Error if createdAt is not a valid datetime', () => {
    // given
    const createdAt = null as unknown as string;

    // when
    expect(() => {
      transformServiceProvider({
        ...serviceProviderMock,
        createdAt,
      });

      // then
    }).toThrow('Unable to parse service provider payload item');
  });

  it('should not throw an Error if createdAt is a valid datetime', () => {
    // given
    const createdAt = '2022-07-29T14:41:26.437Z';

    // when
    expect(() => {
      transformServiceProvider({
        ...serviceProviderMock,
        createdAt,
      });

      // then
    }).not.toThrow('Unable to parse service provider payload item');
  });

  it('should return a formatted service provide item', () => {
    // given
    const createdAt = null as unknown as string;
    // when
    expect(() => {
      transformServiceProvider({
        ...serviceProviderMock,
        createdAt,
      });

      // then
    }).toThrow('Unable to parse service provider payload item');
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
    };

    mocked(t).mockReturnValue('chaine traduite');

    // when
    const result = transformServiceProvider({
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
    };

    mocked(t).mockReturnValue('chaine traduite');

    // when
    const result = transformServiceProvider({
      ...serviceProviderMock,
      datapasses: [],
    });

    // then
    expect(result).toStrictEqual(expected);
  });
});
