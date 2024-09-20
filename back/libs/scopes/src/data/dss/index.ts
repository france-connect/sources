import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './dss.claims';
import { provider } from './dss.provider';
import { scopes } from './dss.scopes';

export const dss: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
