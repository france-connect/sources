import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './cnaf-msa.claims';
import { provider } from './cnaf-msa.provider';
import { scopes } from './cnaf-msa.scopes';

export const cnafMsa: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
