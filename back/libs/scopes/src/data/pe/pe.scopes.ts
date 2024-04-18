import { oneToOneScopeFromClaims } from '../../helpers';
import { ScopesInterface } from '../../interfaces';
import { claims } from './pe.claims';

export const scopes: ScopesInterface = {
  // Automatically create a one-to-one scope for each claim
  ...oneToOneScopeFromClaims(claims),
};
