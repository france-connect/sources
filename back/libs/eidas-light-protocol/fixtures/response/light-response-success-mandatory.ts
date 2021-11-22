import {
  EidasLevelOfAssurances,
  EidasNameIdFormats,
  EidasResponse,
} from '@fc/eidas';

import { IJsonifiedLightResponseXml } from '../../src/interfaces';

export const successMandatoryJsonMock: EidasResponse = {
  id: '_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u',
  inResponseToId: '1602861970744',
  issuer:
    'https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata',
  subject: '0123456',
  subjectNameIdFormat: EidasNameIdFormats.PERSISTENT,
  levelOfAssurance: EidasLevelOfAssurances.SUBSTANTIAL,
  status: {
    failure: false,
  },
  attributes: {
    personIdentifier: ['BE/FR/12345'],
    currentFamilyName: ['Garcia'],
    currentGivenName: ['javier'],
    dateOfBirth: ['1964-12-31'],
  },
};

export const lightResponseSuccessMandatoryJsonMock: IJsonifiedLightResponseXml =
  {
    _declaration: {
      _attributes: { version: '1.0', encoding: 'UTF-8', standalone: 'yes' },
    },
    lightResponse: {
      id: {
        _text:
          '_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u',
      },
      inResponseToId: {
        _text: '1602861970744',
      },
      issuer: {
        _text:
          'https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata',
      },
      subjectNameIdFormat: {
        _text: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
      },
      subject: {
        _text: '0123456',
      },
      levelOfAssurance: {
        _text: 'http://eidas.europa.eu/LoA/substantial',
      },
      status: {
        failure: {
          _text: 'false',
        },
      },
      attributes: {
        attribute: [
          {
            definition: {
              _text:
                'http://eidas.europa.eu/attributes/naturalperson/PersonIdentifier',
            },
            value: {
              _text: 'BE/FR/12345',
            },
          },
          {
            definition: {
              _text:
                'http://eidas.europa.eu/attributes/naturalperson/CurrentFamilyName',
            },
            value: {
              _text: 'Garcia',
            },
          },
          {
            definition: {
              _text:
                'http://eidas.europa.eu/attributes/naturalperson/CurrentGivenName',
            },
            value: {
              _text: 'javier',
            },
          },
          {
            definition: {
              _text:
                'http://eidas.europa.eu/attributes/naturalperson/DateOfBirth',
            },
            value: {
              _text: '1964-12-31',
            },
          },
        ],
      },
    },
  };

export const lightResponseSuccessMandatoryXmlMock = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lightResponse>
  <id>_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u</id>
  <inResponseToId>1602861970744</inResponseToId>
  <issuer>https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata</issuer>
  <subjectNameIdFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</subjectNameIdFormat>
  <subject>0123456</subject>
  <levelOfAssurance>http://eidas.europa.eu/LoA/substantial</levelOfAssurance>
  <status>
    <failure>false</failure>
  </status>
  <attributes>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/PersonIdentifier</definition>
      <value>BE/FR/12345</value>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/CurrentFamilyName</definition>
      <value>Garcia</value>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/CurrentGivenName</definition>
      <value>javier</value>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/DateOfBirth</definition>
      <value>1964-12-31</value>
    </attribute>
  </attributes>
</lightResponse>
`;
