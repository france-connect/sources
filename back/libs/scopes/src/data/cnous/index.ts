import { IProviderMappings } from '../../interfaces';
import { claims } from './cnous.claims';
import { labels } from './cnous.labels';
import { provider } from './cnous.provider';
import { scopes } from './cnous.scopes';

export const cnous: IProviderMappings = {
  provider,
  claims,
  labels,
  scopes,
};
