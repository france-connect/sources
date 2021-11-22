# Library ApacheIgnite

## Objective

Handles the communication with an apache ignite cache using the node module **apache-ignite-client**.

## Description

See [Apache ignite NodeJS thin client](https://ignite.apache.org/docs/latest/thin-clients/nodejs-thin-client)

Instanciates an apache ignite client and connects to an apache ignite server at module initialization.

Can prepare and serve instances to manipulate caches.

Disconnect gracefully the client when the module is being destroyed.

Log any connect or disconnect event.

## To go further

- [Key-Value operations](https://ignite.apache.org/docs/latest/thin-clients/nodejs-thin-client#using-key-value-api)
- [NodeJS examples](https://github.com/apache/ignite/tree/master/modules/platforms/nodejs/examples)
