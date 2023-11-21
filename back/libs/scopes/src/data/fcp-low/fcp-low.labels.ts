import { ILabelMapping } from '../../interfaces';
import { claims } from './fcp-low.claims';

export const labels: ILabelMapping<typeof claims> = {
  sub: null,
  gender: 'Sexe',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: 'Prénom(s)',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name_array: null,
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  idp_birthdate: null,
  amr: null,
};
