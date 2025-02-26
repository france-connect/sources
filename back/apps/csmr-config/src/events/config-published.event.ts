import { ConfigMessageDto } from '@fc/csmr-config-client';

export class ConfigPublishedEvent {
  constructor(public readonly message: ConfigMessageDto) {}
}
