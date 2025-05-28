import { FSA } from '@fc/common';
import { diffKeys } from '@fc/config-abstract-adapter';
import { ActionTypes, ConfigMessageDto } from '@fc/csmr-config-client';

export interface ConfigPublishedEventPropertiesInterface extends FSA {
  type: ActionTypes;
  payload: {
    message: ConfigMessageDto;
  };
  meta: {
    id: string;
    diff?: diffKeys;
  };
}
