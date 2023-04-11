import { ILabelMapping } from '../../interfaces';
import { claims } from './fcp-high.claims';

export const labels: ILabelMapping<typeof claims> = {
  sub: null,
  gender: 'Sexe',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: 'Prénom(s)',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  family_name: 'Nom de naissance',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preferred_username: 'Nom d’usage',
  birthdate: 'Date de naissance',
  birthplace: 'Lieu de naissance',
  birthcountry: 'Pays de naissance',
  address: 'Adresse postale',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  phone_number: 'Téléphone',
  email: 'Adresse email',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_gender: null,
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_given_name: null,
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_given_name_array: null,
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_family_name: null,
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthdate: null,
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthplace: null,
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthcountry: null,
};
