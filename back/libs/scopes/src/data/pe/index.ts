import { IProviderMappings } from '../../interfaces';
import { claims } from './pe.claims';
import { labels } from './pe.labels';
import { provider } from './pe.provider';
import { scopes } from './pe.scopes';

export const pe: IProviderMappings = {
  provider,
  claims,
  labels,
  scopes,
};
