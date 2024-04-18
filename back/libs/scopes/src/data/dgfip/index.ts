import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './dgfip.claims';
import { provider } from './dgfip.provider';
import { scopes } from './dgfip.scopes';

export const dgfip: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
