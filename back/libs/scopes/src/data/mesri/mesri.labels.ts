import { ILabelMapping } from '../../interfaces';
import { claims } from './mesri.claims';

export const labels: ILabelMapping<typeof claims> = {
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mesri_identifiant:
    "Identifiant national étudiant (Ministère de l’Enseignement supérieur, de la Recherche et de l'Innovation)",

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mesri_inscription_etudiant:
    'Formation initiale (Ministère de l’Enseignement supérieur, de la Recherche et de l’Innovation)',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mesri_inscription_autre:
    'Formation continue (Ministère de l’Enseignement supérieur, de la Recherche et de l’Innovation)',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mesri_admission:
    'Admission (Ministère de l’Enseignement supérieur, de la Recherche et de l’Innovation)',

  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mesri_etablissements:
    'Établissements (Ministère de l’Enseignement supérieur, de la Recherche et de l’Innovation)',
};
