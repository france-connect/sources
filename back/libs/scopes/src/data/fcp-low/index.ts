import { IProviderMappings } from '../../interfaces';
import { claims } from './fcp-low.claims';
import { labels } from './fcp-low.labels';
import { provider } from './fcp-low.provider';
import { scopes } from './fcp-low.scopes';

export const fcpLow: IProviderMappings = {
  provider,
  claims,
  labels,
  scopes,
};
