import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { I18nService } from '@fc/i18n';
import { ProviderInterface, RichClaimInterface } from '@fc/scopes';
import { Providers } from '@fc/scopes/enum';

import { getConfigMock } from '@mocks/config';
import { getI18nServiceMock } from '@mocks/i18n';

import { ScopesHelper } from './scopes.helper';

describe('ScopesHelpers', () => {
  let helper: ScopesHelper;

  const configMock = getConfigMock();
  const i18nMock = getI18nServiceMock();

  const configDataMock = {
    sortedClaims: ['y', 'z', 'x'],
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ScopesHelper, ConfigService, I18nService],
    })

      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(I18nService)
      .useValue(i18nMock)
      .compile();

    helper = module.get<ScopesHelper>(ScopesHelper);

    configMock.get.mockReturnValue(configDataMock);
    /**
     *  @note Dirty yet simple workaround to remove hardcoded translation prefix in code
     */
    i18nMock.translate.mockImplementation((key) => key.replace('claim.', ''));
  });

  it('should be defined', () => {
    expect(helper).toBeDefined();
  });

  describe('claimOrder()', () => {
    beforeEach(() => {
      helper['isIdentityClaim'] = jest.fn().mockReturnValue(false);
    });

    it('should sort identity claims according to config', () => {
      // Given
      helper['isIdentityClaim'] = jest.fn().mockReturnValue(true);

      const claimsMock: RichClaimInterface[] = [
        {
          provider: {} as unknown as ProviderInterface,
          identifier: 'x',
          label: 'x',
        },
        {
          provider: {} as unknown as ProviderInterface,
          identifier: 'y',
          label: 'y',
        },
        {
          provider: {} as unknown as ProviderInterface,
          identifier: 'z',
          label: 'z',
        },
      ];

      // When
      const result = claimsMock.sort(helper.claimOrder.bind(helper));

      // Then
      expect(result[0].identifier).toEqual('y');
      expect(result[1].identifier).toEqual('z');
      expect(result[2].identifier).toEqual('x');
    });

    it('should sort non identity claims alphabetically', () => {
      // Given
      const claimsMock: RichClaimInterface[] = [
        {
          provider: {} as unknown as ProviderInterface,
          identifier: 'c',
          label: 'c',
        },
        {
          provider: {} as unknown as ProviderInterface,
          identifier: 'a',
          label: 'a',
        },
        {
          provider: {} as unknown as ProviderInterface,
          identifier: 'b',
          label: 'b',
        },
      ];

      // When
      const result = claimsMock.sort(helper.claimOrder.bind(helper));

      // Then
      expect(result[0].identifier).toEqual('a');
      expect(result[1].identifier).toEqual('b');
      expect(result[2].identifier).toEqual('c');
    });

    it('If they are identity claims, it should push claims not in sortedClaims to the end', () => {
      // Given
      helper['isIdentityClaim'] = jest.fn().mockReturnValue(true);

      const claimsMock: RichClaimInterface[] = [
        {
          provider: {} as unknown as ProviderInterface,
          identifier: 'z',
          label: 'Z',
        },
        {
          provider: {} as unknown as ProviderInterface,
          identifier: 'a',
          label: 'A',
        },
        {
          provider: {} as unknown as ProviderInterface,
          identifier: 'y',
          label: 'Y',
        },
      ];

      // When
      const result = claimsMock.sort(helper.claimOrder.bind(helper));

      // Then
      expect(result[0].identifier).toEqual('y');
      expect(result[1].identifier).toEqual('z');
      expect(result[2].identifier).toEqual('a');
    });
  });

  describe('groupByDataProvider()', () => {
    // Given
    const claimsMock: RichClaimInterface[] = [
      {
        provider: {
          key: 'b',
          label: 'b',
        } as unknown as ProviderInterface,
        identifier: 'b',
        label: 'b',
      },
      {
        provider: {
          key: Providers.FCP_HIGH,
          label: 'x',
        } as unknown as ProviderInterface,
        identifier: 'x',
        label: 'x',
      },
      {
        provider: {
          key: 'a',
          label: 'a',
        } as unknown as ProviderInterface,
        identifier: 'a',
        label: 'a',
      },
      {
        provider: {
          key: 'a',
          label: 'a',
        } as unknown as ProviderInterface,
        identifier: 'c',
        label: 'c',
      },
      {
        provider: {
          key: Providers.FCP_HIGH,
          label: 'x',
        } as unknown as ProviderInterface,
        identifier: 'z',
        label: 'z',
      },
    ];

    const resultMock = [
      [
        {
          provider: {
            key: Providers.FCP_HIGH,
            label: 'x',
          } as unknown as ProviderInterface,
          identifier: 'x',
          label: 'x',
        },
        {
          provider: {
            key: Providers.FCP_HIGH,
            label: 'x',
          } as unknown as ProviderInterface,
          identifier: 'z',
          label: 'z',
        },
      ],
      [
        {
          provider: {
            key: 'a',
            label: 'a',
          } as unknown as ProviderInterface,
          identifier: 'a',
          label: 'a',
        },
        {
          provider: {
            key: 'a',
            label: 'a',
          } as unknown as ProviderInterface,
          identifier: 'c',
          label: 'c',
        },
      ],
      [
        {
          provider: {
            key: 'b',
            label: 'b',
          } as unknown as ProviderInterface,
          identifier: 'b',
          label: 'b',
        },
      ],
    ];

    it('should return claims grouped and sorted by data provider and sort identity claims first', () => {
      // When
      const result = helper.groupByDataProvider(claimsMock);

      // Then
      expect(result).toStrictEqual(resultMock);
    });
  });

  describe('addLabel()', () => {
    // Given
    const claimMock = {
      identifier: 'a',
      provider: Symbol('provider'),
    } as unknown as RichClaimInterface;

    const translateResult = Symbol('translateResult');

    it('should call translate with a key prefix and claim.identifier', () => {
      // Given
      i18nMock.translate.mockReturnValueOnce(translateResult);

      // When
      helper['addLabel'](claimMock);

      // Then
      expect(i18nMock.translate).toHaveBeenCalledTimes(1);
      expect(i18nMock.translate).toHaveBeenCalledWith(
        `claim.${claimMock.identifier}`,
      );
    });

    it('should add label from i18n.translate() to claim', () => {
      // Given
      i18nMock.translate.mockReturnValueOnce(translateResult);

      // When
      const result = helper['addLabel'](claimMock);

      // Then
      expect(result).toStrictEqual({
        ...claimMock,
        label: translateResult,
      });
    });
  });

  describe('dataProviderOrder', () => {
    const claimsMockA = [
      {
        provider: { label: 'a' },
      },
    ] as RichClaimInterface[];

    const claimsMockB: RichClaimInterface[] = [
      {
        provider: { label: 'b' },
      },
    ] as RichClaimInterface[];

    it('should return -1 if a is identity claim', () => {
      // Given
      helper['isIdentityClaim'] = jest.fn().mockReturnValueOnce(true);

      // When
      const result = helper['dataProviderOrder'](claimsMockA, claimsMockB);

      // Then
      expect(result).toEqual(-1);
    });

    it('should return 1 if b is identity claim', () => {
      // Given
      helper['isIdentityClaim'] = jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // When
      const result = helper['dataProviderOrder'](claimsMockB, claimsMockA);

      // Then
      expect(result).toEqual(1);
    });

    it('should return -1 if a provider label is before b provider label', () => {
      // Given
      helper['isIdentityClaim'] = jest.fn().mockReturnValue(false);

      // When
      const result = helper['dataProviderOrder'](claimsMockA, claimsMockB);

      // Then
      expect(result).toEqual(-1);
    });

    it('should return 1 if a provider label is after b provider label', () => {
      // Given
      helper['isIdentityClaim'] = jest.fn().mockReturnValue(false);

      // When
      const result = helper['dataProviderOrder'](claimsMockB, claimsMockA);

      // Then
      expect(result).toEqual(1);
    });
  });
});
