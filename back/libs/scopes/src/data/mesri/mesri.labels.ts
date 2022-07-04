import { ILabelMapping } from '../../interfaces';
import { claims } from './mesri.claims';

export const labels: ILabelMapping<typeof claims> = {
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mesri_identifiant: 'Identifiant national étudiant',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mesri_inscription_etudiant: 'Formation initiale',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mesri_inscription_autre: 'Formation continue',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mesri_admission: 'Admission',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mesri_etablissements: 'Établissements',
};
