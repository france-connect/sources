import { IProviderMappings } from '../../interfaces';
import { claims } from './mi.claims';
import { labels } from './mi.labels';
import { provider } from './mi.provider';
import { scopes } from './mi.scopes';

export const mi: IProviderMappings = {
  provider,
  claims,
  labels,
  scopes,
};
