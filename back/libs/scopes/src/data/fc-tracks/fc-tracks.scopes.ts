import { IScopes } from '../../interfaces';
import { claims } from './fc-tracks.claims';

export const scopes: IScopes = {
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  connexion_tracks: [claims.connexion_tracks],
};
