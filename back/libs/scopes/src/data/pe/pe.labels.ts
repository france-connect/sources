import { ILabelMapping } from '../../interfaces';
import { claims } from './pe.claims';

export const labels: ILabelMapping<typeof claims> = {
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'api_fc-liste-paiementsv1': 'Indemnités de Pôle emploi',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'api_fc-statutaugmentev1': 'Statut demandeur d’emploi',
};
