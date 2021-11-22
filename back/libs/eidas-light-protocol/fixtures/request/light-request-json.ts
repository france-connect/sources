export const lightRequestJsonMock = {
  _declaration: {
    _attributes: {
      version: '1.0',
      encoding: 'UTF-8',
      standalone: 'yes',
    },
  },
  lightRequest: {
    citizenCountryCode: {
      _text: 'BE',
    },
    id: {
      _text: 'Auduye7263',
    },
    issuer: {
      _text: 'EIDASBridge',
    },
    levelOfAssurance: {
      _text: 'http://eidas.europa.eu/LoA/substantial',
    },
    nameIdFormat: {
      _text: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
    },
    providerName: {
      _text: 'FranceConnect',
    },
    spType: {
      _text: 'public',
    },
    relayState: {
      _text: 'myState',
    },
    requestedAttributes: {
      attribute: [
        {
          definition: {
            _text:
              'http://eidas.europa.eu/attributes/naturalperson/PersonIdentifier',
          },
        },
        {
          definition: {
            _text:
              'http://eidas.europa.eu/attributes/naturalperson/CurrentFamilyName',
          },
        },
        {
          definition: {
            _text:
              'http://eidas.europa.eu/attributes/naturalperson/CurrentGivenName',
          },
        },
        {
          definition: {
            _text:
              'http://eidas.europa.eu/attributes/naturalperson/DateOfBirth',
          },
        },
        {
          definition: {
            _text:
              'http://eidas.europa.eu/attributes/naturalperson/CurrentAddress',
          },
        },
        {
          definition: {
            _text: 'http://eidas.europa.eu/attributes/naturalperson/Gender',
          },
        },
        {
          definition: {
            _text: 'http://eidas.europa.eu/attributes/naturalperson/BirthName',
          },
        },
        {
          definition: {
            _text:
              'http://eidas.europa.eu/attributes/naturalperson/PlaceOfBirth',
          },
        },
      ],
    },
  },
};
