import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './fcp-low.claims';
import { provider } from './fcp-low.provider';
import { scopes } from './fcp-low.scopes';

export const fcpLow: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
