import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './fc-tracks.claims';
import { provider } from './fc-tracks.provider';
import { scopes } from './fc-tracks.scopes';

export const fcTracks: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
