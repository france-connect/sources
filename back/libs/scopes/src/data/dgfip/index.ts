import { IProviderMappings } from '../../interfaces';
import { claims } from './dgfip.claims';
import { labels } from './dgfip.labels';
import { provider } from './dgfip.provider';
import { scopes } from './dgfip.scopes';

export const dgfip: IProviderMappings = {
  provider,
  claims,
  labels,
  scopes,
};
