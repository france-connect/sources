import {
  PartnersServiceProviderInstance,
  PartnersServiceProviderInstanceVersion,
} from '@entities/typeorm';

import {
  ActionTypes,
  ConfigCreateViaMessageDtoPayload,
} from '@fc/csmr-config-client';

export interface InstancePublicationInterface {
  instanceId: PartnersServiceProviderInstance['id'];
  versionId: PartnersServiceProviderInstanceVersion['id'];
  payload: ConfigCreateViaMessageDtoPayload;
  type: ActionTypes;
}
