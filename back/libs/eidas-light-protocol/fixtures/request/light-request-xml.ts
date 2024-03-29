export const lightRequestXmlMock = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lightRequest xmlns="http://cef.eidas.eu/LightRequest">
  <citizenCountryCode>BE</citizenCountryCode>
  <id>Auduye7263</id>
  <issuer>EIDASBridge</issuer>
  <levelOfAssurance>http://eidas.europa.eu/LoA/substantial</levelOfAssurance>
  <nameIdFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</nameIdFormat>
  <providerName>FranceConnect</providerName>
  <spType>public</spType>
  <relayState>myState</relayState>
  <requestedAttributes>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/PersonIdentifier</definition>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/CurrentFamilyName</definition>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/CurrentGivenName</definition>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/DateOfBirth</definition>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/CurrentAddress</definition>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/Gender</definition>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/BirthName</definition>
    </attribute>
    <attribute>
      <definition>http://eidas.europa.eu/attributes/naturalperson/PlaceOfBirth</definition>
    </attribute>
  </requestedAttributes>
</lightRequest>`;
