# Library EidasLightProtocol

## Objective

Handles the parsing and the generation of XML light-request and light-response used by the eIDAS Nodes to communicate with member states backends.

## Description

See **Appendix A.2.1** of the [eIDAS-Node National IdP and SP Integration Guide v2.4][1] for more details.

- Takes a JSON request object and generate a XML light-request alongside its token.
- Takes a XML light-request and produce a request JSON object.

See **Appendix A.2.2** of the [eIDAS-Node National IdP and SP Integration Guide v2.4][1] for more details.

- Takes a JSON response object and generate a XML light-response alongside its token.
- Takes a XML light-response and produce a response JSON object.

See **section 4.4.1 - Implementing the LightToken** of [eIDAS-Node National IdP and SP Integration Guide v2.4][1].

- Takes a token of a light-request or light-response, validates its structure while parsing it, then return it to JSON format.
- Takes informations and generate a token for a light-request or light-response.

## To go further

- [eIDAS SAML Attribute Profile v1.2.pdf](https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eIDAS+eID+Profile?preview=/82773108/148898847/eIDAS%20SAML%20Attribute%20Profile%20v1.2%20Final.pdf) for more details on the attribute profile.
- [eIDAS Message Format v1.2.pdf](https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eIDAS+eID+Profile?preview=/82773108/148898844/eIDAS%20SAML%20Message%20Format%20v.1.2%20Final.pdf) for more details on the formats.

[1]: https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eIDAS-Node+version+2.4?preview=/174391771/174391830/eIDAS-Node%20National%20IdP%20and%20SP%20Integration%20Guide%20v2.4.pdf
