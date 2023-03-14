import { ILabelMapping } from '../../interfaces';
import { claims } from './fc-tracks.claims';

export const labels: ILabelMapping<typeof claims> = {
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  connexion_tracks: 'Historique de connexions',
};
