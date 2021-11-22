# Library EidasClient

## Objective

Handles the communication between the eIDAS FR node and FranceConnect when a european citizen wants to access a french service-provider.

## Description

The library takes a JSON request in the session and format it to the "light-request" format of the eIDAS FR Node (aka. eidas-light-protocol) before writing it to the FR Node connector cache request cache.

See **Appendix A.2.1** of the [eIDAS-Node National IdP and SP Integration Guide v2.4][1] for more details.

It then waits for the FR Node to call back with a token. The token should then be checked using the method described at the end of **section 4.4.1 - Implementing the LightToken** of [eIDAS-Node National IdP and SP Integration Guide v2.4][1].

The light-response is read from the the FR Node connector cache response cache. Its size should also be validated as described in **section 4.2.9 - Incoming Light Response Validation** of [eIDAS-Node National IdP and SP Integration Guide v2.4][1].

Finally, the light-response is transformed to JSON format and written to the session before passing the hand.

See **Appendix A.2.2** of the [eIDAS-Node National IdP and SP Integration Guide v2.4][1] for more details.

## To go further

- [Eidas Provider](../eidas-provider/README.md) Library (as it's basically a mirror implementation)
- [Apache Ignite](../apache-ignite/README.md) Library
- [Eidas Light Protocol](../eidas-light-protocol/README.md) Library

[1]: https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eIDAS-Node+version+2.4?preview=/174391771/174391830/eIDAS-Node%20National%20IdP%20and%20SP%20Integration%20Guide%20v2.4.pdf
