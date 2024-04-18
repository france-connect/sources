import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './cnous.claims';
import { provider } from './cnous.provider';
import { scopes } from './cnous.scopes';

export const cnous: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
