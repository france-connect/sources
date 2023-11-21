import { ClientMetadata } from 'oidc-provider';
import { Client, custom, Issuer } from 'openid-client';

import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';

import {
  OidcClientIdpDisabledException,
  OidcClientIdpNotFoundException,
} from '../exceptions';
import { OidcClientConfigService } from './oidc-client-config.service';
import { OidcClientIssuerService } from './oidc-client-issuer.service';

jest.mock('openid-client');

describe('OidcClientIssuerService', () => {
  let service: OidcClientIssuerService;

  const customMock = jest.mocked(custom);

  customMock.setHttpOptionsDefaults = jest.fn();

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
    businessEvent: jest.fn(),
  } as unknown as LoggerService;

  const oidcClientConfigServiceMock = {
    get: jest.fn(),
  };

  const issuerProxyMock = jest.fn() as unknown as Issuer<Client>;
  issuerProxyMock['discover'] = jest.fn();

  const idpMetadataIssuerMock = {
    issuer: 'https://corev2.docker.dev-franceconnect.fr',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    token_endpoint: 'https://corev2.docker.dev-franceconnect.fr/api/v2/token',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    authorization_endpoint:
      'https://corev2.docker.dev-franceconnect.fr/api/v2/authorize',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    jwks_uri: 'https://corev2.docker.dev-franceconnect.fr/api/v2/certs',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_endpoint:
      'https://corev2.docker.dev-franceconnect.fr/api/v2/userinfo',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    end_session_endpoint:
      'https://corev2.docker.dev-franceconnect.fr/api/v2/session/end',
  };

  const idpMetadataClientMock = {
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_id: 'clientID',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_secret: '7vhnwzo1yUVOJT9GJ91gD5oid56effu1',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    response_types: ['code'],
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_signed_response_alg: 'HS256',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    token_endpoint_auth_method: 'client_secret_post',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    revocation_endpoint_auth_method: 'client_secret_post',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_encrypted_response_alg: 'RSA-OAEP',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_encrypted_response_enc: 'A256GCM',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_encrypted_response_alg: 'RSA-OAEP',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_encrypted_response_enc: 'A256GCM',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_signed_response_alg: 'HS256',
  };

  const idpMetadataMock = {
    jwks: [],
    httpOptions: {},
    providers: [
      {
        uid: 'idpUidMock',
        name: 'idpNameMock',
        // oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        response_types: ['response', 'types'],
        // oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        discoveryUrl: 'mock well-known url',
      },
    ],
    // oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    redirectUri: ['redirect', 'uris'],
    // oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    postLogoutRedirectUri: ['post', 'logout', 'redirect', 'uri'],
    client: idpMetadataClientMock,
    issuer: idpMetadataIssuerMock,
    discovery: true,
    discoveryUrl: 'mock well-known url',
    fapi: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcClientIssuerService,
        LoggerService,
        OidcClientConfigService,
      ],
    })
      .overrideProvider(OidcClientConfigService)
      .useValue(oidcClientConfigServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<OidcClientIssuerService>(OidcClientIssuerService);

    jest.resetAllMocks();

    service['IssuerProxy'] = issuerProxyMock as any;
    oidcClientConfigServiceMock.get.mockResolvedValue(idpMetadataMock);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('onModuleInit', () => {
    it('should set httpOptions on client', async () => {
      // When
      await service.onModuleInit();

      // Then
      expect(customMock.setHttpOptionsDefaults).toHaveBeenCalledTimes(1);
      expect(customMock.setHttpOptionsDefaults).toHaveBeenCalledWith(
        idpMetadataMock.httpOptions,
      );
    });

    it('should log', async () => {
      // When
      await service.onModuleInit();

      // Then
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledWith(
        'Initializing oidc-client',
      );
    });
  });

  describe('getClientClass', () => {
    it('should return "Client"', async () => {
      // Given
      oidcClientConfigServiceMock.get.mockResolvedValueOnce({ fapi: false });
      // When
      const result = await service['getClientClass']();
      // Then
      expect(result).toBe('Client');
    });

    it('should return "FAPI1Client"', async () => {
      // Given
      oidcClientConfigServiceMock.get.mockResolvedValueOnce({ fapi: true });
      // When
      const result = await service['getClientClass']();
      // Then
      expect(result).toBe('FAPI1Client');
    });
  });

  describe('getClient', () => {
    // Given
    const issuerMock = {
      Client: jest.fn(),
    };

    const issuerId = 'foo';

    beforeEach(() => {
      service['getIdpMetadata'] = jest.fn().mockResolvedValue(idpMetadataMock);
      service['getIssuer'] = jest.fn().mockResolvedValue(issuerMock);
    });

    it('should call getIssuer', async () => {
      // When
      await service.getClient(issuerId);
      // Then
      expect(service['getIssuer']).toHaveBeenCalledTimes(1);
      expect(service['getIssuer']).toHaveBeenCalledWith(issuerId);
    });

    it('should instantiate new client', async () => {
      // When
      await service.getClient(issuerId);
      // Then
      expect(issuerMock.Client).toHaveBeenCalledTimes(1);
      expect(issuerMock.Client).toHaveBeenCalledWith(
        idpMetadataClientMock,
        idpMetadataMock.jwks,
      );
    });

    it('should call config', async () => {
      // Given
      service['getClientClass'] = jest.fn().mockResolvedValue('Client'); // Inhibate getClientClass own calls
      // When
      await service.getClient(issuerId);
      // Then
      expect(oidcClientConfigServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call getClientClass', async () => {
      // Given
      service['getClientClass'] = jest.fn().mockResolvedValue('Client');
      // When
      await service.getClient(issuerId);
      // Then
      expect(service['getClientClass']).toHaveBeenCalledTimes(1);
    });

    it('should return created client instance', async () => {
      // Given
      const clientInstanceMock = {};
      issuerMock.Client.mockReturnValue(clientInstanceMock);
      // When
      const result = await service.getClient(issuerId);
      // Then
      expect(result).toBe(clientInstanceMock);
    });
  });

  describe('getIssuer', () => {
    beforeEach(() => {
      service['getIdpMetadata'] = jest.fn().mockResolvedValue(idpMetadataMock);
    });
    it('should call getIdpMetadata', async () => {
      // Given
      const issuerId = 'foo';
      // When
      await service['getIssuer'](issuerId);
      // Then
      expect(service['getIdpMetadata']).toHaveBeenCalledTimes(1);
      expect(service['getIdpMetadata']).toHaveBeenCalledWith(issuerId);
    });
    it('should call IssuerProxy.discover', async () => {
      // Given
      const issuerId = 'foo';
      // When
      await service['getIssuer'](issuerId);
      // Then
      expect(issuerProxyMock.discover).toHaveBeenCalledTimes(1);
      expect(issuerProxyMock.discover).toHaveBeenCalledWith(
        idpMetadataMock.discoveryUrl,
      );
    });

    it('should instantiate IssuerProxy', async () => {
      // Given
      const issuerId = 'foo';
      const noDiscoveryMetadata = {
        ...idpMetadataMock,
        discovery: false,
      };
      service['getIdpMetadata'] = jest
        .fn()
        .mockResolvedValue(noDiscoveryMetadata);
      // When
      await service['getIssuer'](issuerId);
      // Then
      expect(service['IssuerProxy']).toHaveBeenCalledTimes(1);
      expect(service['IssuerProxy']).toHaveBeenCalledWith(
        idpMetadataIssuerMock,
      );
    });
  });

  describe('getIdpMetadata', () => {
    // Given
    const providerMock1 = {
      name: 'provider1',
      uid: 'p1',
      active: true,
    } as unknown as ClientMetadata;
    const providerMock2 = {
      name: 'provider2',
      uid: 'p2',
      active: true,
    } as unknown as ClientMetadata;
    const providerMock3 = {
      name: 'provider3',
      uid: 'p3',
      active: false,
    } as unknown as ClientMetadata;
    const providers = [providerMock1, providerMock2, providerMock3];

    it('should return provider in config', async () => {
      // Given
      oidcClientConfigServiceMock.get.mockResolvedValue({
        ...idpMetadataMock,
        providers,
      });
      // When
      const result = await service['getIdpMetadata']('p2');
      // Then
      expect(result).toEqual({
        ...providerMock2,
        client: {
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          post_logout_redirect_uris: [idpMetadataMock.postLogoutRedirectUri],
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          redirect_uris: [idpMetadataMock.redirectUri],
        },
      });
    });
    it('should throw if provider is not in config', async () => {
      // Given
      oidcClientConfigServiceMock.get.mockResolvedValue({ providers });
      // Then
      await expect(service['getIdpMetadata']('p0')).rejects.toThrow(
        OidcClientIdpNotFoundException,
      );
    });
    it('should throw if provider is not active', async () => {
      // Given
      oidcClientConfigServiceMock.get.mockResolvedValue({ providers });
      // Then
      await expect(service['getIdpMetadata']('p3')).rejects.toThrow(
        OidcClientIdpDisabledException,
      );
    });
  });
});
