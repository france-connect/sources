import { ILabelMapping } from '../../interfaces';
import { claims } from './mi.claims';

export const labels: ILabelMapping<typeof claims> = {
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mi_siv_carte_grise: 'Informations de la carte grise: Titulaire et véhicule',
};
