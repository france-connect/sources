import {
  DeviceAuth,
  DeviceNamespaces,
  DeviceResponse,
  DeviceSigned,
  Document,
  Header,
  IssuerAuth,
  IssuerSigned,
  IssuerSignedItem,
  ProtectedHeaders,
  ValidityInfo,
} from '@owf/mdoc';

import { Test, TestingModule } from '@nestjs/testing';

import { MdocDeviceAuthTypeEnum } from '../enums';
import { MdocDecodeException } from '../exceptions';
import { MdocIssuerSignedInterface, MdocValueDigest } from '../interfaces';
import { MdocDecoderService } from './mdoc-decoder.service';

jest.mock('@owf/mdoc', () => ({
  DeviceResponse: {
    decode: jest.fn(),
    fromEncodedForOid4Vp: jest.fn(),
  },
  Header: {
    Algorithm: 1,
  },
  IssuerSigned: {
    decode: jest.fn(),
  },
}));

describe('MdocDecoderService', () => {
  let service: MdocDecoderService;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MdocDecoderService],
    }).compile();

    service = module.get<MdocDecoderService>(MdocDecoderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('decodeDeviceResponse', () => {
    const documents = [{ docType: 'x' }, { docType: 'y' }];
    const vpToken = 'token';

    beforeEach(() => {
      service['safeDecodeDeviceResponse'] = jest
        .fn()
        .mockReturnValue({ documents });
      service['mapDocument'] = jest.fn();
    });

    it('should safely decode a device response', () => {
      // When
      service.decodeDeviceResponse(vpToken);

      // Then
      expect(service['safeDecodeDeviceResponse']).toHaveBeenCalledWith(vpToken);
    });

    it('should map document to MdocDocumentInterface', () => {
      // When
      service.decodeDeviceResponse(vpToken);

      // Then
      expect(service['mapDocument']).toHaveBeenNthCalledWith(1, documents[0]);
      expect(service['mapDocument']).toHaveBeenNthCalledWith(2, documents[1]);
    });

    it('should return empty array if there are no documents', () => {
      // Given
      service['safeDecodeDeviceResponse'] = jest
        .fn()
        .mockReturnValue({ documents: [] });

      // When
      const result = service.decodeDeviceResponse(vpToken);

      // Then
      expect(result).toEqual([]);
    });

    it('should return empty array documents is undefined', () => {
      // Given
      service['safeDecodeDeviceResponse'] = jest.fn().mockReturnValue({});

      // When
      const result = service.decodeDeviceResponse(vpToken);

      // Then
      expect(result).toEqual([]);
    });
  });

  describe('decodeIssuerSigned', () => {
    const bytes = new Uint8Array([1, 2, 3]);
    const issuerSignedClassMock = jest.mocked(IssuerSigned);
    const issuerSignedMock = Symbol() as unknown as IssuerSigned;
    const mappedIssuerSignedMock =
      Symbol() as unknown as MdocIssuerSignedInterface;

    beforeEach(() => {
      service['mapIssuerSigned'] = jest.fn();
      issuerSignedClassMock.decode.mockReturnValue(issuerSignedMock);
    });

    it('should decode bytes with IssuerSigned.decode', () => {
      // When
      service.decodeIssuerSigned(bytes);

      // Then
      expect(issuerSignedClassMock.decode).toHaveBeenCalledExactlyOnceWith(
        bytes,
      );
    });

    it('should throw MdocDecodeException if IssuerSigned.decode throws', () => {
      // Given
      issuerSignedClassMock.decode.mockImplementationOnce(() => {
        throw new Error('test');
      });

      // Then / When
      expect(() => service.decodeIssuerSigned(bytes)).toThrow(
        MdocDecodeException,
      );
    });

    it('should throw MdocDecodeException if mapIssuerSigned throws', () => {
      // Given
      service['mapIssuerSigned'] = jest.fn().mockImplementationOnce(() => {
        throw new Error('test');
      });

      // Then / When
      expect(() => service.decodeIssuerSigned(bytes)).toThrow(
        MdocDecodeException,
      );
    });

    it('should map decoded issuer signed to MdocIssuerSignedInterface', () => {
      // When
      service.decodeIssuerSigned(bytes);

      // Then
      expect(service['mapIssuerSigned']).toHaveBeenCalledWith(issuerSignedMock);
    });

    it('should return mapped issuer signed', () => {
      // Given
      service['mapIssuerSigned'] = jest
        .fn()
        .mockReturnValue(mappedIssuerSignedMock);

      // When
      const result = service.decodeIssuerSigned(bytes);

      // Then
      expect(result).toEqual(mappedIssuerSignedMock);
    });
  });

  describe('safeDecodeDeviceResponse', () => {
    const deviceResponseClassMock = jest.mocked(DeviceResponse);
    const deviceResponseStringMock = Symbol() as unknown as DeviceResponse;
    const deviceResponseUint8ArrayMock = Symbol() as unknown as DeviceResponse;

    beforeEach(() => {
      deviceResponseClassMock.fromEncodedForOid4Vp.mockReturnValue(
        deviceResponseStringMock,
      );
      deviceResponseClassMock.decode.mockReturnValue(
        deviceResponseUint8ArrayMock,
      );
    });

    it('should decode vpToken with DeviceResponse.fromEncodedForOid4Vp if vpToken is a string', () => {
      // Given
      const vpToken = 'token';

      // When
      service['safeDecodeDeviceResponse'](vpToken);

      // Then
      expect(
        deviceResponseClassMock.fromEncodedForOid4Vp,
      ).toHaveBeenCalledExactlyOnceWith(vpToken);
      expect(deviceResponseClassMock.decode).not.toHaveBeenCalled();
    });

    it('should return the decoded device response if vpToken is a string', () => {
      // Given
      const vpToken = 'token';

      // When
      const result = service['safeDecodeDeviceResponse'](vpToken);

      // Then
      expect(result).toEqual(deviceResponseStringMock);
    });

    it('should throw MdocDecodeException if DeviceResponse.fromEncodedForOid4Vp throws', () => {
      // Given
      const vpToken = 'token';
      deviceResponseClassMock.fromEncodedForOid4Vp.mockImplementationOnce(
        () => {
          throw new Error('test');
        },
      );

      // Then / When
      expect(() => service['safeDecodeDeviceResponse'](vpToken)).toThrow(
        MdocDecodeException,
      );
    });

    it('should decode vpToken with DeviceResponse.decode if vpToken is a Uint8Array', () => {
      // Given
      const vpToken = new Uint8Array([1, 2, 3]);

      // When
      service['safeDecodeDeviceResponse'](vpToken);

      // Then
      expect(deviceResponseClassMock.decode).toHaveBeenCalledExactlyOnceWith(
        vpToken,
      );
      expect(
        deviceResponseClassMock.fromEncodedForOid4Vp,
      ).not.toHaveBeenCalled();
    });

    it('should return the decoded device response if vpToken is a Uint8Array', () => {
      // Given
      const vpToken = new Uint8Array([1, 2, 3]);

      // When
      const result = service['safeDecodeDeviceResponse'](vpToken);

      // Then
      expect(result).toEqual(deviceResponseUint8ArrayMock);
    });

    it('should throw MdocDecodeException if DeviceResponse.decode throws', () => {
      // Given
      const vpToken = new Uint8Array([1, 2, 3]);
      deviceResponseClassMock.decode.mockImplementationOnce(() => {
        throw new Error('test');
      });

      // Then / When
      expect(() => service['safeDecodeDeviceResponse'](vpToken)).toThrow(
        MdocDecodeException,
      );
    });

    it('should throw MdocDecodeException if vpToken is neither a string nor a Uint8Array', () => {
      // Given
      const vpToken = 42 as unknown as string;

      // Then / When
      expect(() => service['safeDecodeDeviceResponse'](vpToken)).toThrow(
        MdocDecodeException,
      );
      expect(
        deviceResponseClassMock.fromEncodedForOid4Vp,
      ).not.toHaveBeenCalled();
      expect(deviceResponseClassMock.decode).not.toHaveBeenCalled();
    });
  });

  describe('mapDocument', () => {
    it('should map docType, issuerSigned and deviceSigned', () => {
      // Given
      const documentMock = {
        docType: 'org.iso.18013.5.1.mDL',
        issuerSigned: Symbol(),
        deviceSigned: Symbol(),
      };
      const issuerSignedMock = Symbol();
      const deviceSignedMock = Symbol();
      service['mapIssuerSigned'] = jest.fn().mockReturnValue(issuerSignedMock);
      service['mapDeviceSigned'] = jest.fn().mockReturnValue(deviceSignedMock);

      // When
      const result = service['mapDocument'](
        documentMock as unknown as Document,
      );

      // Then
      expect(service['mapIssuerSigned']).toHaveBeenCalledWith(
        documentMock.issuerSigned,
      );
      expect(service['mapDeviceSigned']).toHaveBeenCalledWith(
        documentMock.deviceSigned,
      );
      expect(result).toEqual({
        docType: documentMock.docType,
        issuerSigned: issuerSignedMock,
        deviceSigned: deviceSignedMock,
      });
    });
  });

  describe('mapIssuerSigned', () => {
    it('should map nameSpaces, mso and x509Chain', () => {
      // Given
      const issuerAuthMock = Symbol();
      const issuerSignedMock = {
        issuerAuth: issuerAuthMock,
      };
      const nameSpacesMock = Symbol();
      const msoMock = Symbol();
      const x509ChainMock = Symbol();
      service['mapIssuerNameSpaces'] = jest
        .fn()
        .mockReturnValue(nameSpacesMock);
      service['mapMso'] = jest.fn().mockReturnValue(msoMock);
      service['extractX509Chain'] = jest.fn().mockReturnValue(x509ChainMock);

      // When
      const result = service['mapIssuerSigned'](issuerSignedMock as never);

      // Then
      expect(service['mapIssuerNameSpaces']).toHaveBeenCalledWith(
        issuerSignedMock,
      );
      expect(service['mapMso']).toHaveBeenCalledWith(issuerAuthMock);
      expect(service['extractX509Chain']).toHaveBeenCalledWith(issuerAuthMock);
      expect(result).toEqual({
        nameSpaces: nameSpacesMock,
        mso: msoMock,
        x509Chain: x509ChainMock,
      });
    });
  });

  describe('mapIssuerNameSpaces', () => {
    it('should delegate mapping to toIssuerNameSpacesMap', () => {
      // Given
      const issuerNamespacesMock = new Map();
      const issuerSignedMock = {
        issuerNamespaces: {
          issuerNamespaces: issuerNamespacesMock,
        },
      };
      const mappedNameSpacesMock = Symbol();
      service['toIssuerNameSpacesMap'] = jest
        .fn()
        .mockReturnValue(mappedNameSpacesMock);

      // When
      const result = service['mapIssuerNameSpaces'](
        issuerSignedMock as unknown as IssuerSigned,
      );

      // Then
      expect(service['toIssuerNameSpacesMap']).toHaveBeenCalledWith(
        issuerNamespacesMock,
      );
      expect(result).toEqual(mappedNameSpacesMock);
    });
  });

  describe('toIssuerNameSpacesMap', () => {
    it('should return an empty map when issuerNamespaces is undefined', () => {
      // When
      const result = service['toIssuerNameSpacesMap'](undefined);

      // Then
      expect(result).toEqual(new Map());
    });

    it('should map each namespace with mapIssuerSignedItems', () => {
      // Given
      const namespace1Items = [Symbol()] as unknown as IssuerSignedItem[];
      const namespace2Items = [Symbol()] as unknown as IssuerSignedItem[];
      const issuerNamespaces = new Map<string, IssuerSignedItem[]>([
        ['namespace-1', namespace1Items],
        ['namespace-2', namespace2Items],
      ]);
      service['mapIssuerSignedItems'] = jest
        .fn()
        .mockReturnValueOnce(['mapped-1'])
        .mockReturnValueOnce(['mapped-2']);

      // When
      const result = service['toIssuerNameSpacesMap'](
        issuerNamespaces as unknown as Map<string, IssuerSignedItem[]>,
      );

      // Then
      expect(service['mapIssuerSignedItems']).toHaveBeenNthCalledWith(
        1,
        namespace1Items,
      );
      expect(service['mapIssuerSignedItems']).toHaveBeenNthCalledWith(
        2,
        namespace2Items,
      );
      expect(result).toEqual(
        new Map([
          ['namespace-1', ['mapped-1']],
          ['namespace-2', ['mapped-2']],
        ]),
      );
    });
  });

  describe('mapIssuerSignedItems', () => {
    it('should map issuer signed items to mdoc issuer signed item interface', () => {
      // Given
      const items = [
        {
          digestId: 1,
          elementIdentifier: 'family_name',
          elementValue: 'DUPONT',
          random: 'ignored',
        },
      ];

      // When
      const result = service['mapIssuerSignedItems'](
        items as unknown as IssuerSignedItem[],
      );

      // Then
      expect(result).toEqual([
        {
          digestID: 1,
          elementIdentifier: 'family_name',
          elementValue: 'DUPONT',
        },
      ]);
    });

    it('should map issuer signed items to mdoc issuer signed item interface when elementValue is a Map', () => {
      // Given
      const items = [
        {
          digestId: 1,
          elementIdentifier: 'given_name',
          elementValue: new Map([
            ['first', 'ADAM'],
            ['second', 'JOHN'],
          ]),
          random: 'ignored',
        },
      ];

      // When
      const result = service['mapIssuerSignedItems'](
        items as unknown as IssuerSignedItem[],
      );

      // Then
      expect(result).toEqual([
        {
          digestID: 1,
          elementIdentifier: 'given_name',
          elementValue: { first: 'ADAM', second: 'JOHN' },
        },
      ]);
    });
  });

  describe('mapToObject', () => {
    it('should map Map to object', () => {
      // Given
      const map = new Map([
        ['first', 'ADAM'],
        ['second', 'JOHN'],
      ]);

      // When
      const result = service['mapToObject'](map);

      // Then
      expect(result).toEqual({ first: 'ADAM', second: 'JOHN' });
    });

    it('should return the value if it is not a Map', () => {
      // Given
      const value = 'ADAM';

      // When
      const result = service['mapToObject'](value);

      // Then
      expect(result).toEqual(value);
    });
  });

  describe('mapMso', () => {
    it('should map mso fields with valueDigests and validityInfo', () => {
      // Given
      const valueDigestsMock = new Map<string, MdocValueDigest>([
        ['namespace', new Map([[1, new Uint8Array([1, 2, 3])]])],
      ]);
      const validityInfoMock = Symbol();
      const issuerAuthMock = {
        mobileSecurityObject: {
          version: '1.0',
          digestAlgorithm: 'SHA-256',
          docType: 'org.iso.18013.5.1.mDL',
          valueDigests: { valueDigests: valueDigestsMock },
          validityInfo: validityInfoMock,
        },
      };
      const mappedValueDigestsMock = Symbol();
      const mappedValidityInfoMock = Symbol();
      service['mapValueDigests'] = jest
        .fn()
        .mockReturnValue(mappedValueDigestsMock);
      service['mapValidityInfo'] = jest
        .fn()
        .mockReturnValue(mappedValidityInfoMock);

      // When
      const result = service['mapMso'](issuerAuthMock as unknown as IssuerAuth);

      // Then
      expect(service['mapValueDigests']).toHaveBeenCalledWith(valueDigestsMock);
      expect(service['mapValidityInfo']).toHaveBeenCalledWith(validityInfoMock);
      expect(result).toEqual({
        version: '1.0',
        digestAlgorithm: 'SHA-256',
        docType: 'org.iso.18013.5.1.mDL',
        valueDigests: mappedValueDigestsMock,
        validityInfo: mappedValidityInfoMock,
      });
    });
  });

  describe('mapValueDigests', () => {
    it('should copy nested maps for each namespace', () => {
      // Given
      const digestBytes = new Uint8Array([1, 2, 3]);
      const inner = new Map<string, MdocValueDigest>([
        ['namespace', new Map([[1, digestBytes]])],
      ]);

      // When
      const result = service['mapValueDigests'](inner);

      // Then
      expect(result).toEqual(inner);
      expect(result).not.toBe(inner);
      expect(result.get('namespace')).not.toBe(inner.get('namespace'));
    });
  });

  describe('mapValidityInfo', () => {
    it('should map validity info fields', () => {
      // Given
      const signed = new Date('2026-01-01T00:00:00.000Z');
      const validFrom = new Date('2026-01-02T00:00:00.000Z');
      const validUntil = new Date('2026-01-03T00:00:00.000Z');
      const expectedUpdate = new Date('2026-01-04T00:00:00.000Z');

      // When
      const result = service['mapValidityInfo']({
        signed,
        validFrom,
        validUntil,
        expectedUpdate,
      } as unknown as ValidityInfo);

      // Then
      expect(result).toEqual({
        signed,
        validFrom,
        validUntil,
        expectedUpdate,
      });
    });
  });

  describe('extractX509Chain', () => {
    it('should return x5chain when present', () => {
      // Given
      const x5chain = [new Uint8Array([1])];
      const certificateChain = [new Uint8Array([2])];

      // When
      const result = service['extractX509Chain']({
        x5chain,
        certificateChain,
      } as unknown as IssuerAuth);

      // Then
      expect(result).toBe(x5chain);
    });

    it('should return certificateChain when x5chain is empty', () => {
      // Given
      const x5chain: Uint8Array[] = [];
      const certificateChain = [new Uint8Array([2])];

      // When
      const result = service['extractX509Chain']({
        x5chain,
        certificateChain,
      } as unknown as IssuerAuth);

      // Then
      expect(result).toBe(certificateChain);
    });
  });

  describe('mapDeviceSigned', () => {
    it('should map device namespaces and device auth', () => {
      // Given
      const deviceNamespacesMock = Symbol();
      const deviceAuthMock = Symbol();
      const deviceSignedMock = {
        deviceNamespaces: deviceNamespacesMock,
        deviceAuth: deviceAuthMock,
      };
      const mappedNameSpacesMock = Symbol();
      const mappedDeviceAuthMock = Symbol();
      service['mapDeviceNameSpaces'] = jest
        .fn()
        .mockReturnValue(mappedNameSpacesMock);
      service['mapDeviceAuth'] = jest
        .fn()
        .mockReturnValue(mappedDeviceAuthMock);

      // When
      const result = service['mapDeviceSigned'](
        deviceSignedMock as unknown as DeviceSigned,
      );

      // Then
      expect(service['mapDeviceNameSpaces']).toHaveBeenCalledWith(
        deviceNamespacesMock,
      );
      expect(service['mapDeviceAuth']).toHaveBeenCalledWith(deviceAuthMock);
      expect(result).toEqual({
        nameSpaces: mappedNameSpacesMock,
        deviceAuth: mappedDeviceAuthMock,
      });
    });
  });

  describe('mapDeviceNameSpaces', () => {
    it('should map device signed items into nested maps', () => {
      // Given
      const deviceSignedItems = new Map<string, unknown>([
        ['given_name', 'JOHN'],
      ]);
      const deviceNamespaces = {
        deviceNamespaces: new Map([
          ['org.iso.18013.5.1', { deviceSignedItems }],
        ]),
      };

      // When
      const result = service['mapDeviceNameSpaces'](
        deviceNamespaces as unknown as DeviceNamespaces,
      );

      // Then
      expect(result).toEqual(
        new Map([['org.iso.18013.5.1', new Map([['given_name', 'JOHN']])]]),
      );
      expect(result.get('org.iso.18013.5.1')).not.toBe(deviceSignedItems);
    });
  });

  describe('mapDeviceAuth', () => {
    it('should return signature auth when deviceSignature is present', () => {
      // Given
      const protectedHeaders = Symbol();
      service['readProtectedAlgorithm'] = jest.fn().mockReturnValue(-7);

      // When
      const result = service['mapDeviceAuth']({
        deviceSignature: { protectedHeaders },
      } as unknown as DeviceAuth);

      // Then
      expect(service['readProtectedAlgorithm']).toHaveBeenCalledWith(
        protectedHeaders,
      );
      expect(result).toEqual({
        type: MdocDeviceAuthTypeEnum.SIGNATURE,
        algorithm: -7,
      });
    });

    it('should return mac auth when deviceMac is present', () => {
      // Given
      const protectedHeaders = Symbol();
      service['readProtectedAlgorithm'] = jest.fn().mockReturnValue(5);

      // When
      const result = service['mapDeviceAuth']({
        deviceMac: { protectedHeaders },
      } as unknown as DeviceAuth);

      // Then
      expect(service['readProtectedAlgorithm']).toHaveBeenCalledWith(
        protectedHeaders,
      );
      expect(result).toEqual({
        type: MdocDeviceAuthTypeEnum.MAC,
        algorithm: 5,
      });
    });

    it('should throw MdocDecodeException when both deviceSignature and deviceMac are missing', () => {
      // Then / When
      expect(() =>
        service['mapDeviceAuth']({} as unknown as DeviceAuth),
      ).toThrow(MdocDecodeException);
    });
  });

  describe('readProtectedAlgorithm', () => {
    it('should return algorithm when header value is a number', () => {
      // Given
      const protectedHeaders = {
        headers: new Map([[Header.Algorithm, -7]]),
      };

      // When
      const result = service['readProtectedAlgorithm'](
        protectedHeaders as unknown as ProtectedHeaders,
      );

      // Then
      expect(result).toBe(-7);
    });

    it('should throw MdocDecodeException when header value is not a number', () => {
      // Given
      const protectedHeaders = {
        headers: new Map([[Header.Algorithm, 'invalid']]),
      };

      // Then / When
      expect(() =>
        service['readProtectedAlgorithm'](
          protectedHeaders as unknown as ProtectedHeaders,
        ),
      ).toThrow(MdocDecodeException);
    });
  });
});
