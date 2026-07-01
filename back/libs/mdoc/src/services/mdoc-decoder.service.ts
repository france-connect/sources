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

import { Injectable } from '@nestjs/common';

import {
  MdocAlgorithmsEnum,
  MdocDeviceAuthTypeEnum,
  MdocDigestAlgorithmsEnum,
} from '../enums';
import { MdocDecodeException } from '../exceptions';
import {
  MdocDeviceAuthInterface,
  MdocDeviceNameSpaces,
  MdocDeviceSignedInterface,
  MdocDocumentInterface,
  MdocIssuerNameSpaces,
  MdocIssuerSignedInterface,
  MdocIssuerSignedItemInterface,
  MdocMsoInterface,
  MdocValidityInfoInterface,
  MdocValueDigest,
  MdocValueDigests,
} from '../interfaces';

@Injectable()
export class MdocDecoderService {
  decodeDeviceResponse(vpToken: string | Uint8Array): MdocDocumentInterface[] {
    const deviceResponse = this.safeDecodeDeviceResponse(vpToken);

    const documents = deviceResponse.documents;
    if (!documents?.length) {
      return [];
    }

    return documents.map((document) => this.mapDocument(document));
  }

  decodeIssuerSigned(bytes: Uint8Array): MdocIssuerSignedInterface {
    try {
      const issuerSigned = IssuerSigned.decode(bytes);
      return this.mapIssuerSigned(issuerSigned);
    } catch {
      throw new MdocDecodeException();
    }
  }

  private safeDecodeDeviceResponse(
    vpToken: string | Uint8Array,
  ): DeviceResponse {
    try {
      if (typeof vpToken === 'string') {
        return DeviceResponse.fromEncodedForOid4Vp(vpToken);
      }

      if (vpToken instanceof Uint8Array) {
        return DeviceResponse.decode(vpToken);
      }
    } catch (error) {
      throw new MdocDecodeException(error);
    }

    throw new MdocDecodeException(
      'Wrong type for vpToken, expected string or Uint8Array',
    );
  }

  private mapDocument(document: Document): MdocDocumentInterface {
    return {
      docType: document.docType,
      issuerSigned: this.mapIssuerSigned(document.issuerSigned),
      deviceSigned: this.mapDeviceSigned(document.deviceSigned),
    };
  }

  private mapIssuerSigned(
    issuerSigned: IssuerSigned,
  ): MdocIssuerSignedInterface {
    const issuerAuth = issuerSigned.issuerAuth;
    return {
      nameSpaces: this.mapIssuerNameSpaces(issuerSigned),
      mso: this.mapMso(issuerAuth),
      x509Chain: this.extractX509Chain(issuerAuth),
    };
  }

  private mapIssuerNameSpaces(
    issuerSigned: IssuerSigned,
  ): MdocIssuerNameSpaces {
    const issuerNamespaces = issuerSigned.issuerNamespaces?.issuerNamespaces;
    return this.toIssuerNameSpacesMap(issuerNamespaces);
  }

  private toIssuerNameSpacesMap(
    issuerNamespaces: Map<string, IssuerSignedItem[]> | undefined,
  ): MdocIssuerNameSpaces {
    if (!issuerNamespaces?.size) {
      return new Map();
    }

    const result = new Map<string, MdocIssuerSignedItemInterface[]>();
    for (const [namespace, items] of issuerNamespaces) {
      result.set(namespace, this.mapIssuerSignedItems(items));
    }

    return result;
  }

  private mapIssuerSignedItems(
    items: IssuerSignedItem[],
  ): MdocIssuerSignedItemInterface[] {
    return items.map((item) => ({
      digestID: item.digestId,
      elementIdentifier: item.elementIdentifier,
      elementValue: item.elementValue,
    }));
  }

  private mapMso(issuerAuth: IssuerAuth): MdocMsoInterface {
    const mso = issuerAuth.mobileSecurityObject;

    return {
      version: mso.version,
      digestAlgorithm: mso.digestAlgorithm as MdocDigestAlgorithmsEnum,
      docType: mso.docType,
      valueDigests: this.mapValueDigests(mso.valueDigests.valueDigests),
      validityInfo: this.mapValidityInfo(mso.validityInfo),
    };
  }

  private mapValueDigests(inner: MdocValueDigests): MdocValueDigests {
    const result = new Map<string, MdocValueDigest>();

    for (const [namespace, digests] of inner) {
      result.set(namespace, new Map(digests));
    }

    return result;
  }

  private mapValidityInfo(
    validityInfo: ValidityInfo,
  ): MdocValidityInfoInterface {
    return {
      signed: validityInfo.signed,
      validFrom: validityInfo.validFrom,
      validUntil: validityInfo.validUntil,
      expectedUpdate: validityInfo.expectedUpdate,
    };
  }

  private extractX509Chain(issuerAuth: IssuerAuth): readonly Uint8Array[] {
    const fromHeader = issuerAuth.x5chain;

    if (fromHeader?.length) {
      return fromHeader;
    }

    return issuerAuth.certificateChain;
  }

  private mapDeviceSigned(
    deviceSigned: DeviceSigned,
  ): MdocDeviceSignedInterface {
    return {
      nameSpaces: this.mapDeviceNameSpaces(deviceSigned.deviceNamespaces),
      deviceAuth: this.mapDeviceAuth(deviceSigned.deviceAuth),
    };
  }

  private mapDeviceNameSpaces(
    deviceNamespaces: DeviceNamespaces,
  ): MdocDeviceNameSpaces {
    const out = new Map<string, Map<string, unknown>>();

    for (const [namespace, signedItems] of deviceNamespaces.deviceNamespaces) {
      out.set(namespace, new Map(signedItems.deviceSignedItems));
    }

    return out;
  }

  private mapDeviceAuth(deviceAuth: DeviceAuth): MdocDeviceAuthInterface {
    if (deviceAuth.deviceSignature) {
      return {
        type: MdocDeviceAuthTypeEnum.SIGNATURE,
        algorithm: this.readProtectedAlgorithm(
          deviceAuth.deviceSignature.protectedHeaders,
        ),
      };
    }

    if (deviceAuth.deviceMac) {
      return {
        type: MdocDeviceAuthTypeEnum.MAC,
        algorithm: this.readProtectedAlgorithm(
          deviceAuth.deviceMac.protectedHeaders,
        ),
      };
    }

    throw new MdocDecodeException();
  }

  private readProtectedAlgorithm(
    protectedHeaders: ProtectedHeaders,
  ): MdocAlgorithmsEnum {
    const alg = protectedHeaders.headers.get(Header.Algorithm);

    if (typeof alg !== 'number') {
      throw new MdocDecodeException(
        'Algorithm not found or invalid in protected headers',
      );
    }

    return alg as MdocAlgorithmsEnum;
  }
}
