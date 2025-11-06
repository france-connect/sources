import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './ants.claims';
import { provider } from './ants.provider';
import { scopes } from './ants.scopes';

export const ants: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
