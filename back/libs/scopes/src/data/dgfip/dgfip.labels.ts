import { ILabelMapping } from '../../interfaces';
import { claims } from './dgfip.claims';

export const labels: ILabelMapping<typeof claims> = {
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_rfr: 'Revenu fiscal de référence',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_annee_n_moins_1: 'Dernière année de revenu',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_annee_n_moins_2: 'Avant-dernière année de revenu',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_annee_n_moins_3: 'Avant-avant-dernière année de revenu',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_nbpart: 'Nombre de parts du foyer fiscal',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_sitfam:
    'Situation de famille (marié, pacsé, célibataire, veuf divorcé)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_aft: 'Adresse déclarée au 1er Janvier',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_nbpac: 'Nombre de personnes à charge',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_inddeficit: 'Indicateur de l’existence d’un déficit',
  // OIDC fashion variable nam
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_pariso: 'Parent isolé (case T)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_decl: 'État-civil des déclarants du foyer fiscal',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_pac: 'Détail des personnes à charge et rattachées',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_locaux_th: 'Données issues de la Taxe d’Habitation',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_nmUsaDec1: 'Nom déclarant 1',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_nmNaiDec1: 'Nom de naissance déclarant 1',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_prnmDec1: 'Prénom déclarant 1',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_dateNaisDec1: 'Date de naissance déclarant 1',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_nmUsaDec2: 'Nom déclarant 2',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_nmNaiDec2: 'Nom de naissance déclarant 2',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_prnmDec2: 'Prénom déclarant 2',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_dateNaisDec2: 'Date de naissance déclarant 2',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_locaux_th_ident: 'Données du local - identifiant du logement',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_locaux_th_Nat: 'Données du local – nature (maison, appartement, ect,)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_locaux_th_Tax:
    'Données du local - régime de taxation (résidence principale uniquement)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_locaux_th_Aff: 'Données du local - affectation (« H » pour habitation)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_pac_nbPac: 'Nombre de personnes à charge',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_mntRevbareme:
    'Montant de l’impôt sur les revenus soumis au barème (ligne 14)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_indiIFI: 'Indicateur ISF/IFI',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevDecl_Cat1_Tspr: 'Catégorie 1 - Salaires, pensions, rentes',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevDecl_Cat1_RentOn: 'Catégorie 1 - Rentes viagères à titre onéreux',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevDecl_Cat2_Rcm: 'Catégorie 2 - Revenus de capitaux mobiliers',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevDecl_Cat3_PMV: 'Catégorie 3 - Plus ou moins values',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevDecl_Cat4_Ref: 'Catégorie 4 - Revenus fonciers',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevDecl_Cat5_NonSal:
    'Catégorie 5 - Revenus des professions non salariées',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevNets_Cat1_Tspr: 'Catégorie 1 - Salaires, pensions, rentes',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevNets_Cat1_RentOn: 'Catégorie 1 - Rentes viagères à titre onéreux',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevNets_Cat2_Rcm: 'Catégorie 2 - Revenus de capitaux mobiliers',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevNets_Cat3_PMV: 'Catégorie 3 - Plus ou moins values',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevNets_Cat4_Ref: 'Catégorie 4 - Revenus fonciers',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_RevNets_Cat5_NonSal:
    'Catégorie 5 - Revenus des professions non salariées',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_PaDeduc_EnfMaj:
    'Pensions alimentaires déductibles - Pension alimentaire versées à enfant majeur',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_PaDeduc_Autres:
    'Pensions alimentaires déductibles - Autres pensions alimentaires versées (enfants mineurs, ascendants, ...)',
  // OIDC fashion variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dgfip_EpargRetrDeduc: 'Versement épargne retraite',
};
