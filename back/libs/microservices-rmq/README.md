# Microservices RMQ

This library defines a paradigm to communicate with microservices through RabbitMQ.

It's purpose is to be used both on the publisher side and subscriber side, by defining providing helpers to define a more business oriented protocol library and a subsriber(consumer).  
The business client library can focus on describing available actions and related I/O DTOs for both publishers and consumers.

A full real life example is available in [`@fc/csmr-config-client`](../csmr-config-client).

> Note that this particular client library embeds its own complexity by being dynamic itself. A more simple implementation should be added to this doc later.

The library suggest the usage of [FSA](../common/src/types/fsa.type.ts) wrapping of the data.

## Usage in publisher

MicroservicesRmq is a dynamic module which takes a string identifier as parameter.

This identifier is used to create a unique DI token but also to name the configuration section in the configuration service for the protocol library.

Example of a client library module relying on `@fc/microservices-rmq`:

```ts
// libs/my-client/my-client.module.ts

import {
  getRmqServiceProvider,
  MicroservicesRmqModule,
} from '@fc/microservices-rmq';

import { MyClientService } from './services';

const serviceName = 'MyClientService';

const pubServiceProvider = getRmqServiceProvider<MyClientService>(
  MyClientService,
  serviceName,
);

@Module({
  imports: [MicroservicesRmqModule.forPublisher(serviceName)],
  providers: [pubServiceProvider],
  exports: [pubServiceProvider],
})
export class MyClientModule {}
```

In your protocol library, a dedicated service is then available to easily publish messages without further coding.

```ts
// Import your DTO to type the message and validate the response
import { MyMessageDto, MyResponseDto } from '../dto';

export class MyClientService {
  // rmqService is the ClientProxy instance that is bound to the configured broker
  constructor(private readonly rmqService: MicroservicesRmqService) {}

  // Just create a publish() method to type
  async publish(message: MyMessageDto): Promise<MyResponseDto> {
    return await this.rmqService.publish<MyMessageDto, MyResponseDto>(
      message.type,
      message,
      MyResponseDto, // <- Response validation DTO
    );
  }
```

## Usage in consumer

The `MicroservicesRmqModule.forSubscriber()` method generate a module that:

- exposes the `MicroservicesRmqSubscriberService`
- loads an `APP_INTERCEPTOR` (mandatory to use `MicroservicesRmqSubscriberService.response()`)
- loads an exception filter

```ts
@Module({
  imports: [MicroservicesRmqModule.forSubscriber()],
  }
})
export class MyClientModule {}
```

### MicroservicesRmqSubscriberService.response()

allows to respond to message in a unified way, wrapping the given payload in an FSA.  
The `meta` property is automatically filled with original message.

```ts
import { MicroservicesRmqSubscriberService } from '@fc/microservices-rmq';

@Injectable()
class SomeConsumerSerice() {

  constructor(private readonly subscriber: MicroservicesRmqSubscriberService) {}

  someMethod() {
    // [...] do something

    this.subscriber.response({/** someData to send back to publisher */});
  }
}

```

### The exception filter

allows consumers to report a more meaningful error to the publisher in the form of a FSA object :

```ts
{
  type: 'FAILURE',
  meta: {
    message: {/***/}, // Original message sent by the publisher (full FSA)
    code: 'Y000042', // exception code from the consumer perspective
    id: '<uuid-v4', // exception unique id from the consumer perspective
  },
  payload: {/***/}, // Serialized exception
}
```
