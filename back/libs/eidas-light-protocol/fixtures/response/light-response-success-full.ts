import {
  EidasLevelOfAssurances,
  EidasNameIdFormats,
  EidasResponse,
  EidasStatusCodes,
} from '@fc/eidas';

import { IJsonifiedLightResponseXml } from '../../src/interfaces';

export const successFullJsonMock: EidasResponse = {
  id: '_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u',
  inResponseToId: '1602861970744',
  issuer:
    'https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata',
  ipAddress: '127.0.0.1',
  relayState: 'myState',
  subject: '0123456',
  subjectNameIdFormat: EidasNameIdFormats.PERSISTENT,
  levelOfAssurance: EidasLevelOfAssurances.SUBSTANTIAL,
  status: {
    failure: false,
    statusCode: EidasStatusCodes.SUCCESS,
    statusMessage: 'myMessage',
  },
  attributes: {
    personIdentifier: ['BE/FR/12345'],
    currentFamilyName: ['Garcia'],
    currentGivenName: ['javier'],
    dateOfBirth: ['1964-12-31'],
    currentAddress: {
      poBox: '1234',
      locatorDesignator: '28',
      locatorName: 'DIGIT building',
      cvaddressArea: 'Etterbeek',
      thoroughfare: 'Rue Belliard',
      postName: 'ETTERBEEK CHASSE',
      adminunitFirstline: 'BE',
      adminunitSecondline: 'ETTERBEEK',
      postCode: '1040',
    },
    gender: ['Male'],
    birthName: ['Ωνάσης', 'Onases'],
    placeOfBirth: ['Place of Birth'],
  },
};

export const lightResponseSuccessFullJsonMock: IJsonifiedLightResponseXml = {
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
    ipAddress: {
      _text: '127.0.0.1',
    },
    relayState: {
      _text: 'myState',
    },
    subjectNameIdFormat: {
      _text: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
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
      statusCode: {
        _text: 'urn:oasis:names:tc:SAML:2.0:status:Success',
      },
      statusMessage: {
        _text: 'myMessage',
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
        {
          definition: {
            _text:
              'http://eidas.europa.eu/attributes/naturalperson/CurrentAddress',
          },
          value: {
            _text:
              'PGVpZGFzLW5hdHVyYWw6UG9Cb3g+MTIzNDwvZWlkYXMtbmF0dXJhbDpQb0JveD4KPGVpZGFzLW5hdHVyYWw6TG9jYXRvckRlc2lnbmF0b3I+Mjg8L2VpZGFzLW5hdHVyYWw6TG9jYXRvckRlc2lnbmF0b3I+CjxlaWRhcy1uYXR1cmFsOkxvY2F0b3JOYW1lPkRJR0lUIGJ1aWxkaW5nPC9laWRhcy1uYXR1cmFsOkxvY2F0b3JOYW1lPgo8ZWlkYXMtbmF0dXJhbDpDdmFkZHJlc3NBcmVhPkV0dGVyYmVlazwvZWlkYXMtbmF0dXJhbDpDdmFkZHJlc3NBcmVhPgo8ZWlkYXMtbmF0dXJhbDpUaG9yb3VnaGZhcmU+UnVlIEJlbGxpYXJkPC9laWRhcy1uYXR1cmFsOlRob3JvdWdoZmFyZT4KPGVpZGFzLW5hdHVyYWw6UG9zdE5hbWU+RVRURVJCRUVLIENIQVNTRTwvZWlkYXMtbmF0dXJhbDpQb3N0TmFtZT4KPGVpZGFzLW5hdHVyYWw6QWRtaW51bml0Rmlyc3RsaW5lPkJFPC9laWRhcy1uYXR1cmFsOkFkbWludW5pdEZpcnN0bGluZT4KPGVpZGFzLW5hdHVyYWw6QWRtaW51bml0U2Vjb25kbGluZT5FVFRFUkJFRUs8L2VpZGFzLW5hdHVyYWw6QWRtaW51bml0U2Vjb25kbGluZT4KPGVpZGFzLW5hdHVyYWw6UG9zdENvZGU+MTA0MDwvZWlkYXMtbmF0dXJhbDpQb3N0Q29kZT4K',
          },
        },
        {
          definition: {
            _text: 'http://eidas.europa.eu/attributes/naturalperson/Gender',
          },
          value: {
            _text: 'Male',
          },
        },
        {
          definition: {
            _text: 'http://eidas.europa.eu/attributes/naturalperson/BirthName',
          },
          value: [
            {
              _text: 'Ωνάσης',
            },
            {
              _text: 'Onases',
            },
          ],
        },
        {
          definition: {
            _text:
              'http://eidas.europa.eu/attributes/naturalperson/PlaceOfBirth',
          },
          value: {
            _text: 'Place of Birth',
          },
        },
      ],
    },
  },
};

export const lightResponseSuccessFullXmlMock = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lightResponse>
  <id>_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u</id>
  <inResponseToId>1602861970744</inResponseToId>
  <issuer>https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata</issuer>
  <ipAddress>127.0.0.1</ipAddress>
  <relayState>myState</relayState>
  <subjectNameIdFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</subjectNameIdFormat>
  <subject>0123456</subject>
  <levelOfAssurance>http://eidas.europa.eu/LoA/substantial</levelOfAssurance>
  <status>
    <failure>false</failure>
    <statusCode>urn:oasis:names:tc:SAML:2.0:status:Success</statusCode>
    <statusMessage>myMessage</statusMessage>
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
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/CurrentAddress</definition>
      <value>PGVpZGFzLW5hdHVyYWw6UG9Cb3g+MTIzNDwvZWlkYXMtbmF0dXJhbDpQb0JveD4KPGVpZGFzLW5hdHVyYWw6TG9jYXRvckRlc2lnbmF0b3I+Mjg8L2VpZGFzLW5hdHVyYWw6TG9jYXRvckRlc2lnbmF0b3I+CjxlaWRhcy1uYXR1cmFsOkxvY2F0b3JOYW1lPkRJR0lUIGJ1aWxkaW5nPC9laWRhcy1uYXR1cmFsOkxvY2F0b3JOYW1lPgo8ZWlkYXMtbmF0dXJhbDpDdmFkZHJlc3NBcmVhPkV0dGVyYmVlazwvZWlkYXMtbmF0dXJhbDpDdmFkZHJlc3NBcmVhPgo8ZWlkYXMtbmF0dXJhbDpUaG9yb3VnaGZhcmU+UnVlIEJlbGxpYXJkPC9laWRhcy1uYXR1cmFsOlRob3JvdWdoZmFyZT4KPGVpZGFzLW5hdHVyYWw6UG9zdE5hbWU+RVRURVJCRUVLIENIQVNTRTwvZWlkYXMtbmF0dXJhbDpQb3N0TmFtZT4KPGVpZGFzLW5hdHVyYWw6QWRtaW51bml0Rmlyc3RsaW5lPkJFPC9laWRhcy1uYXR1cmFsOkFkbWludW5pdEZpcnN0bGluZT4KPGVpZGFzLW5hdHVyYWw6QWRtaW51bml0U2Vjb25kbGluZT5FVFRFUkJFRUs8L2VpZGFzLW5hdHVyYWw6QWRtaW51bml0U2Vjb25kbGluZT4KPGVpZGFzLW5hdHVyYWw6UG9zdENvZGU+MTA0MDwvZWlkYXMtbmF0dXJhbDpQb3N0Q29kZT4K</value>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/Gender</definition>
      <value>Male</value>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/BirthName</definition>
      <value>Ωνάσης</value>
      <value>Onases</value>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/PlaceOfBirth</definition>
      <value>Place of Birth</value>
    </attribute>
  </attributes>
</lightResponse>
`;
