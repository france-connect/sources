import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './mesri.claims';
import { provider } from './mesri.provider';
import { scopes } from './mesri.scopes';

export const mesri: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
