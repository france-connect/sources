import { IEvent } from '@nestjs/cqrs';

export class MongooseConnectionReconnectedEvent implements IEvent {}
