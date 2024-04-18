import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './cnam.claims';
import { provider } from './cnam.provider';
import { scopes } from './cnam.scopes';

export const cnam: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
