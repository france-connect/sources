import { IEvent } from '@nestjs/cqrs';

export class MongooseConnectionDisconnectedEvent implements IEvent {}
