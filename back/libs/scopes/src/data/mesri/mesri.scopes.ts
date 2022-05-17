import { oneToOneScopeFromClaims } from '../../helpers';
import { IScopes } from '../../interfaces';
import { claims } from './mesri.claims';

export const scopes: IScopes = {
  // Automatically create a one-to-one scope for each claim
  ...oneToOneScopeFromClaims(claims),
};
