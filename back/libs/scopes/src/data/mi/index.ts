import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './mi.claims';
import { provider } from './mi.provider';
import { scopes } from './mi.scopes';

export const mi: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
