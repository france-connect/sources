import { FSA } from '@fc/common';
import { diffKeys } from '@fc/config-abstract-adapter';
import {
  ActionTypes,
  ConfigDeleteMessageDto,
  ConfigMessageDto,
} from '@fc/csmr-config-client';

interface ConfigPublishedEventBasePropertiesInterface extends FSA {
  meta: {
    id: string;
    diff?: diffKeys;
  };
}

export interface ConfigWritePublishedEventPropertiesInterface extends ConfigPublishedEventBasePropertiesInterface {
  type: ActionTypes.CONFIG_CREATE | ActionTypes.CONFIG_UPDATE;
  payload: {
    message: ConfigMessageDto;
  };
}

export interface ConfigDeletePublishedEventPropertiesInterface extends ConfigPublishedEventBasePropertiesInterface {
  type: ActionTypes.CONFIG_DELETE;
  payload: {
    message: ConfigDeleteMessageDto;
  };
}

// The deletion message carries a reduced payload, the type discriminates it
// from the create and update ones.
export type ConfigPublishedEventPropertiesInterface =
  | ConfigWritePublishedEventPropertiesInterface
  | ConfigDeletePublishedEventPropertiesInterface;
