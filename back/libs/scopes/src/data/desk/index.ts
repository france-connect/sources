import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './desk.claims';
import { provider } from './desk.provider';
import { scopes } from './desk.scopes';

export const desk: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
