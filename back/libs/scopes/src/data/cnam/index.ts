import { IProviderMappings } from '@fc/scopes/interfaces';

import { claims } from './cnam.claims';
import { labels } from './cnam.labels';
import { provider } from './cnam.provider';
import { scopes } from './cnam.scopes';

export const cnam: IProviderMappings = {
  provider,
  claims,
  labels,
  scopes,
};
