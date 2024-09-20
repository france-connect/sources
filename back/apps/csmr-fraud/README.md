# Consumer Fraud

This consumer is designed to process fraud reports (from the user dashboard) and to perform the initial investigations, in order to generate support tickets containing all the data required. 

#### RabbitMQ

The RabbitMQ container is deployed locally using `docker-compose`:

- It's defined in `./fc/docker/compose/shared/shared.yml` under the container name `csmr-fraud`.
- The following environment variables must be set:
  - `'FraudBroker_URLS=["amqp://broker:5672"]'`
  - `'FraudBroker_QUEUE=fraud'`

The RabbitMQ management interface can be accessed at [RabbitMQ UI](http://localhost:15672/#/queues/%2F/fraud):

- Username: `guest`
- Password: `guest`

Within the `Publish message` section, under the `Payload` field, you can broadcast the following message. This will be received by all applications listening to the `topic` (or `pattern` in NestJS): `GET_HELLO`

For aggregation:

```json
{
  "pattern": "GET_HELLO",
  "data": {}
}
```
