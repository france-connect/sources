import { ILabelMapping } from '../../interfaces';
import { claims } from './cnam.claims';

export const labels: ILabelMapping<typeof claims> = {
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ensagri_releve_note:
    'Relevé de notes (Enseignement Agricole) (Caisse nationale de l’assurance maladie)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  droits_assurance_maladie:
    'Droits assurance maladie (Caisse nationale de l’assurance maladie)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnam_beneficiaires:
    'Liste de vos ayant-droits (Caisse nationale de l’assurance maladie)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnam_contrats: 'Vos droits de base (Caisse nationale de l’assurance maladie)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnam_caisse:
    'Votre caisse gestionnaire (Caisse nationale de l’assurance maladie)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnam_exonerations:
    'Vos exonérations ou modulations éventuelles (Caisse nationale de l’assurance maladie)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnam_medecin_traitant:
    'Votre médecin traitant (Caisse nationale de l’assurance maladie)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnam_presence_medecin_traitant:
    "Présence d'un médecin traitant (Caisse nationale de l’assurance maladie)",
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnam_paiements_ij:
    "Paiements d'indemnités journalières versés par l’Assurance Maladie (Caisse nationale de l’assurance maladie)",
};
