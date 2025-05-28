import { ConfigPublishedEventPropertiesInterface } from '../interfaces';

export class ConfigPublishedEvent {
  constructor(
    public readonly properties: ConfigPublishedEventPropertiesInterface,
  ) {}
}
