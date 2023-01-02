import { ILabelMapping } from '../../interfaces';
import { claims } from './fcp-high.claims';

export const labels: ILabelMapping<typeof claims> = {
  sub: 'sub',
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
  rnipp_gender: 'sexe à la naissance provenant du RNIPP',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_given_name: 'prénoms de naissance provenant du RNIPP',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_family_name: 'nom de famille de naissance provenant du RNIPP',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthdate: 'date de naissance provenant du RNIPP',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthplace: 'COG de la ville de naissance provenant du RNIPP',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthcountry: 'COG du pays de naissance provenant du RNIPP',
};
