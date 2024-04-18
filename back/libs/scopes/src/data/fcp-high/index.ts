import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './fcp-high.claims';
import { provider } from './fcp-high.provider';
import { scopes } from './fcp-high.scopes';

export const fcpHigh: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
