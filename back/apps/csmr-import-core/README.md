# Consumer Import Core

This consumer is designed to import service providers

#### RabbitMQ

The RabbitMQ container is deployed locally using `docker-compose`:

- It's defined in `./fc/docker/compose/shared/shared.yml` under the container name `csmr-import-core`.
- The following environment variables must be set:
  - `'FraudBroker_URLS=["amqp://broker:5672"]'`
  - `'FraudBroker_QUEUE=import-core'`

The RabbitMQ management interface can be accessed at [RabbitMQ UI](http://localhost:15672/#/queues/%2F/import-core):

- Username: `guest`
- Password: `guest`

Within the `Publish message` section, under the `Payload` field, you can broadcast the following message. This will be received by all applications listening to the `topic` (or `pattern` in NestJS): `SP_IMPORT`

For aggregation:

```json
{
  "pattern": "SP_IMPORT",
  "data": {
    "type": "SP_IMPORT",
    "payload": "blablabla"
  }
}
```
