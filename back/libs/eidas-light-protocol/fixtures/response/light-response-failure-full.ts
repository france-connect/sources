import {
  EidasResponse,
  EidasStatusCodes,
  EidasSubStatusCodes,
} from '@fc/eidas';

import { IJsonifiedLightResponseXml } from '../../src/interfaces';

export const failureFullJsonMock: EidasResponse = {
  id: '_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u',
  inResponseToId: '1602861970744',
  issuer:
    'https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata',
  relayState: 'myState',
  status: {
    failure: true,
    statusCode: EidasStatusCodes.RESPONDER,
    subStatusCode: EidasSubStatusCodes.AUTHN_FAILED,
    statusMessage: 'myMessage',
  },
};

export const lightResponseFailureFullJsonMock: IJsonifiedLightResponseXml = {
  _declaration: {
    _attributes: { version: '1.0', encoding: 'UTF-8', standalone: 'yes' },
  },
  lightResponse: {
    id: {
      _text: '_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u',
    },
    inResponseToId: {
      _text: '1602861970744',
    },
    issuer: {
      _text:
        'https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata',
    },
    relayState: {
      _text: 'myState',
    },
    status: {
      failure: {
        _text: 'true',
      },
      statusCode: {
        _text: 'urn:oasis:names:tc:SAML:2.0:status:Responder',
      },
      statusMessage: {
        _text: 'myMessage',
      },
      subStatusCode: {
        _text: 'urn:oasis:names:tc:SAML:2.0:status:AuthnFailed',
      },
    },
  },
};

export const lightResponseFailureFullXmlMock = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lightResponse>
  <id>_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u</id>
  <inResponseToId>1602861970744</inResponseToId>
  <issuer>https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata</issuer>
  <relayState>myState</relayState>
  <status>
    <failure>true</failure>
    <statusCode>urn:oasis:names:tc:SAML:2.0:status:Responder</statusCode>
    <statusMessage>myMessage</statusMessage>
    <subStatusCode>urn:oasis:names:tc:SAML:2.0:status:AuthnFailed</subStatusCode>
  </status>
</lightResponse>
`;
