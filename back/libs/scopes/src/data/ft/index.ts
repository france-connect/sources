import { ProviderMappingsInterface } from '../../interfaces';
import { claims } from './ft.claims';
import { provider } from './ft.provider';
import { scopes } from './ft.scopes';

export const ft: ProviderMappingsInterface = {
  provider,
  claims,
  scopes,
};
