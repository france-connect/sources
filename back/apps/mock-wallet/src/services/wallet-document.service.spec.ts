import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CONFIG_NAMESPACE, MdocService } from '@fc/mdoc';

import { getConfigMock } from '@mocks/config';

import { MockWalletMdocBuildException } from '../exceptions';
import { WalletIdentity } from '../interfaces';
import { WalletDocumentService } from './wallet-document.service';

describe('WalletDocumentService', () => {
  let service: WalletDocumentService;

  const configMock = getConfigMock();
  const mdocMock = {
    buildMdocVpToken: jest.fn(),
  };

  const mdocConfig = {
    docType: 'eu.europa.ec.eudi.pid.1',
    issuerPrivateKeyPem: 'issuer-key-pem',
    issuerCertificatePem: 'issuer-cert-pem',
    devicePrivateKeyJwk: { kty: 'EC', d: 'private' },
    deviceCertificatePem: 'device-cert-pem',
  };

  const request = {
    client_id: 'https://verifier.example/response',
    nonce: 'nonce-mock',
    response_uri: 'https://verifier.example/response',
  };

  const identity: WalletIdentity = {
    docType: 'eu.europa.ec.eudi.pid.1',
    attributes: {
      family_name: 'DUPONT',
      given_name: 'JEAN',
      birth_date: '1985-06-15',
      birth_place: 'Paris',
      nationality: ['FR'],
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    configMock.get.mockImplementation((namespace: string) => {
      if (namespace === CONFIG_NAMESPACE) {
        return mdocConfig;
      }

      return {};
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletDocumentService, ConfigService, MdocService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(MdocService)
      .useValue(mdocMock)
      .compile();

    service = module.get<WalletDocumentService>(WalletDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildVpToken', () => {
    it('should build the vp_token from the selected identity claims', async () => {
      // Given
      const claims = { family_name: 'DUPONT', given_name: 'JEAN' };
      mdocMock.buildMdocVpToken.mockResolvedValue('vp-token-mock');

      // When
      const result = await service.buildVpToken(identity, claims, request);

      // Then
      expect(result).toBe('vp-token-mock');
      expect(configMock.get).toHaveBeenCalledWith(CONFIG_NAMESPACE);
      expect(mdocMock.buildMdocVpToken).toHaveBeenCalledExactlyOnceWith({
        docType: mdocConfig.docType,
        claims,
        issuerPrivateKeyPem: mdocConfig.issuerPrivateKeyPem,
        issuerCertificatePem: mdocConfig.issuerCertificatePem,
        devicePrivateKeyJwk: mdocConfig.devicePrivateKeyJwk,
        deviceCertificatePem: mdocConfig.deviceCertificatePem,
        openid4vpSession: {
          clientId: request.client_id,
          nonce: request.nonce,
          responseUri: request.response_uri,
        },
      });
    });

    it('should throw when the identity docType does not match the configured one', async () => {
      // When / Then
      await expect(
        service.buildVpToken(
          { docType: 'other.doc.type', attributes: {} },
          {},
          request,
        ),
      ).rejects.toThrow(MockWalletMdocBuildException);
    });

    it('should wrap unexpected mdoc build failures', async () => {
      // Given
      mdocMock.buildMdocVpToken.mockRejectedValue(new Error('boom'));

      // When / Then
      await expect(
        service.buildVpToken(identity, { family_name: 'DUPONT' }, request),
      ).rejects.toThrow(MockWalletMdocBuildException);
    });
  });
});
