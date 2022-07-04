import { ILabelMapping } from '../../interfaces';
import { claims } from './cnous.claims';

export const labels: ILabelMapping<typeof claims> = {
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnous_statut_boursier: 'Statut boursier',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnous_echelon_bourse: 'Echelon de la bourse',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnous_email: 'Courriel',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnous_periode_versement: 'Période de versement',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnous_statut_bourse: 'Statut définitif de la bourse',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnous_ville_etudes: 'Ville d’étude',
};
