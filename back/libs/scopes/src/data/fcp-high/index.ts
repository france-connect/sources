import { IProviderMappings } from '../../interfaces';
import { claims } from './fcp-high.claims';
import { labels } from './fcp-high.labels';
import { provider } from './fcp-high.provider';
import { scopes } from './fcp-high.scopes';

export const fcpHigh: IProviderMappings = {
  provider,
  claims,
  labels,
  scopes,
};
