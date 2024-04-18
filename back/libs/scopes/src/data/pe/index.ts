import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './pe.claims';
import { provider } from './pe.provider';
import { scopes } from './pe.scopes';

export const pe: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
