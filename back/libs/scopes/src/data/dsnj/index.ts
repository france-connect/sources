import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './dsnj.claims';
import { provider } from './dsnj.provider';
import { scopes } from './dsnj.scopes';

export const dsnj: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
