import { IProviderMappings } from '../../interfaces';
import { claims } from './fc-tracks.claims';
import { labels } from './fc-tracks.labels';
import { provider } from './fc-tracks.provider';
import { scopes } from './fc-tracks.scopes';

export const fcTracks: IProviderMappings = {
  provider,
  claims,
  labels,
  scopes,
};
