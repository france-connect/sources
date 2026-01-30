import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './asc.claims';
import { provider } from './asc.provider';
import { scopes } from './asc.scopes';

export const asc: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
