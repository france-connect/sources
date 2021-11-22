import { EidasResponse } from '@fc/eidas';

import { IJsonifiedLightResponseXml } from '../../src/interfaces';

export const failureMandatoryJsonMock: EidasResponse = {
  id: '_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u',
  inResponseToId: '1602861970744',
  issuer:
    'https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata',
  status: {
    failure: true,
  },
};

export const lightResponseFailureMandatoryJsonMock: IJsonifiedLightResponseXml =
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
      status: {
        failure: {
          _text: 'true',
        },
      },
    },
  };

export const lightResponseFailureMandatoryXmlMock = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lightResponse>
  <id>_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u</id>
  <inResponseToId>1602861970744</inResponseToId>
  <issuer>https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata</issuer>
  <status>
    <failure>true</failure>
  </status>
</lightResponse>
`;
