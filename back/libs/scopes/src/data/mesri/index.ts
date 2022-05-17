import { IProviderMappings } from '../../interfaces';
import { claims } from './mesri.claims';
import { labels } from './mesri.labels';
import { provider } from './mesri.provider';
import { scopes } from './mesri.scopes';

export const mesri: IProviderMappings = {
  provider,
  claims,
  labels,
  scopes,
};
