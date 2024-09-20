import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { FqdnToIdpAdapterMongoService } from '@fc/fqdn-to-idp-adapter-mongo';

import { getConfigMock } from '@mocks/config';

import { CoreFcaFqdnService } from './core-fca-fqdn.service';

describe('CoreFcaFqdnService', () => {
  let service: CoreFcaFqdnService;

  const fqdnToIdpAdapterMongoMock = {
    getIdpsByFqdn: jest.fn(),
    refreshCache: jest.fn(),
    getList: jest.fn(),
  };

  const configServiceMock = getConfigMock();

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaFqdnService,
        FqdnToIdpAdapterMongoService,
        ConfigService,
      ],
    })
      .overrideProvider(FqdnToIdpAdapterMongoService)
      .useValue(fqdnToIdpAdapterMongoMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = app.get<CoreFcaFqdnService>(CoreFcaFqdnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFqdnFromEmail', () => {
    it('should only return the full qualified domain name from an email address', () => {
      // When
      const fqdn = service.getFqdnFromEmail('hermione.granger@hogwards.uk');

      // Then
      expect(fqdn).toBe('hogwards.uk');
    });

    it('should only return the full qualified domain name from an email address with numbers', () => {
      // When
      const fqdn = service.getFqdnFromEmail(
        'hermione.grangerhogwards4321@hogwards1234.uk',
      );

      // Then
      expect(fqdn).toBe('hogwards1234.uk');
    });

    const emailToTest = [
      {
        value: 'hermione.granger@hogwards1234.uK',
        expectedFqdn: 'hogwards1234.uk',
      },
      {
        value: 'hermione.granger@hogwardS1234.uk',
        expectedFqdn: 'hogwards1234.uk',
      },
      {
        value: 'hermione.granger@hogwardS1234.uK',
        expectedFqdn: 'hogwards1234.uk',
      },
      {
        value: 'hermione.granger@HOGWARDS1234.UK',
        expectedFqdn: 'hogwards1234.uk',
      },
    ];
    it.each(emailToTest)(
      'should always return qualified domain name in lower case from an email address with upper case',
      ({ value, expectedFqdn }) => {
        // When
        const fqdn = service.getFqdnFromEmail(value);

        // Then
        expect(fqdn).toBe(expectedFqdn);
      },
    );
  });

  describe('getFqdnConfigFromEmail', () => {
    it('should return the default idp if no idp is mapped and fqdn accepts default idp', async () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({
        defaultIdpId: 'default-idp',
      });

      const getFqdnFromEmailSpy = jest.spyOn(service, 'getFqdnFromEmail');
      getFqdnFromEmailSpy.mockReturnValueOnce('hogwards.uk');

      fqdnToIdpAdapterMongoMock.getIdpsByFqdn.mockResolvedValueOnce([]);

      // When
      const response = await service.getFqdnConfigFromEmail('hogwards.uk');

      // Then
      const expectedConfig = {
        fqdn: 'hogwards.uk',
        identityProviders: ['default-idp'],
        acceptsDefaultIdp: true,
      };

      expect(response).toEqual(expectedConfig);
    });

    it('should return no idps if no idp is mapped for fqdn and no default idp is set', async () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({
        defaultIdpId: '',
      });

      const getFqdnFromEmailSpy = jest.spyOn(service, 'getFqdnFromEmail');
      getFqdnFromEmailSpy.mockReturnValueOnce('hogwards.uk');

      fqdnToIdpAdapterMongoMock.getIdpsByFqdn.mockResolvedValueOnce([]);

      // When
      const response = await service.getFqdnConfigFromEmail('hogwards.uk');

      // Then
      const expectedConfig = {
        fqdn: 'hogwards.uk',
        identityProviders: [],
        acceptsDefaultIdp: false,
      };

      expect(response).toEqual(expectedConfig);
    });

    it('should return the idps mapped and the default idp when there is a default idp and fqdn accepts default idp', async () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({
        defaultIdpId: 'default-idp',
      });

      const getFqdnFromEmailSpy = jest.spyOn(service, 'getFqdnFromEmail');
      getFqdnFromEmailSpy.mockReturnValueOnce('hogwards.uk');

      fqdnToIdpAdapterMongoMock.getIdpsByFqdn.mockResolvedValueOnce([
        {
          fqdn: 'hogwards.uk',
          identityProvider: 'idp1',
          acceptsDefaultIdp: true,
        },
        {
          fqdn: 'hogwards.uk',
          identityProvider: 'idp2',
          acceptsDefaultIdp: true,
        },
      ]);

      // When
      const response = await service.getFqdnConfigFromEmail('hogwards.uk');

      // Then
      const expectedConfig = {
        fqdn: 'hogwards.uk',
        identityProviders: ['idp1', 'idp2', 'default-idp'],
        acceptsDefaultIdp: true,
      };

      expect(response).toEqual(expectedConfig);
    });

    it("should return the idps mapped but not the default idp when there is a default idp but fqdn doesn't accepts default idp", async () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({
        defaultIdpId: 'default-idp',
      });

      const getFqdnFromEmailSpy = jest.spyOn(service, 'getFqdnFromEmail');
      getFqdnFromEmailSpy.mockReturnValueOnce('hogwards.uk');

      fqdnToIdpAdapterMongoMock.getIdpsByFqdn.mockResolvedValueOnce([
        {
          fqdn: 'hogwards.uk',
          identityProvider: 'idp1',
          acceptsDefaultIdp: false,
        },
        {
          fqdn: 'hogwards.uk',
          identityProvider: 'idp2',
          acceptsDefaultIdp: true,
        },
      ]);

      // When
      const response = await service.getFqdnConfigFromEmail('hogwards.uk');

      // Then
      const expectedConfig = {
        fqdn: 'hogwards.uk',
        identityProviders: ['idp1', 'idp2'],
        acceptsDefaultIdp: false,
      };

      expect(response).toEqual(expectedConfig);
    });
  });

  describe('addDefaultIdp', () => {
    it('should return idps provider list with default idp when there is more than one idp', () => {
      // Given
      const idpsSet = new Set(['idp1', 'idp2']);
      // When
      const result = service['addDefaultIdp'](true, idpsSet, 'default-idp');
      // Then
      expect(result).toEqual(new Set(['idp1', 'idp2', 'default-idp']));
    });

    it('should return idp provider uid without default idp when there is only one idp', () => {
      // Given
      const idpsSet = new Set(['idp1']);
      // When
      const result = service['addDefaultIdp'](true, idpsSet, 'default-idp');
      // Then
      expect(result).toEqual(new Set(['idp1']));
    });

    it('should return idp provider uid with default idp without duplicate', () => {
      // Given
      const idpsSet = new Set(['idp1', 'default-idp']);
      // When
      const result = service['addDefaultIdp'](true, idpsSet, 'default-idp');
      // Then
      expect(result).toEqual(new Set(['idp1', 'default-idp']));
    });
  });
});
