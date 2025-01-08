// -- Scopes - set all scopes by types with a description label
print("Add scopes index");
db.scopes.createIndex({ scope: 1 }, { unique: true });

const scopeList = [
  { scope: "openid", fd: "IDENTITY", label: "" },
  { scope: "given_name", fd: "IDENTITY", label: "Prénom(s)" },
  { scope: "family_name", fd: "IDENTITY", label: "Nom de naissance" },
  { scope: "preferred_username", fd: "IDENTITY", label: "" },
  { scope: "birthdate", fd: "IDENTITY", label: "" },
  { scope: "gender", fd: "IDENTITY", label: "" },
  { scope: "birthplace", fd: "IDENTITY", label: "" },
  { scope: "birthcountry", fd: "IDENTITY", label: "" },
  { scope: "email", fd: "IDENTITY", label: "" },
  { scope: "address", fd: "IDENTITY", label: "" },
  { scope: "phone", fd: "IDENTITY", label: "" },
  { scope: "profile", fd: "IDENTITY", label: "" },
  { scope: "birth", fd: "IDENTITY", label: "" },
  { scope: "identite_pivot", fd: "IDENTITY", label: "" },
  { scope: "rnipp_given_name", fd: "IDENTITY", label: "Prénom(s)" },
  { scope: "rnipp_family_name", fd: "IDENTITY", label: "Nom de naissance" },
  { scope: "rnipp_gender", fd: "IDENTITY", label: "Sexe" },
  { scope: "rnipp_birthcountry", fd: "IDENTITY", label: "Pays de naissance" },
  { scope: "rnipp_birthplace", fd: "IDENTITY", label: "Lieu de naissance" },
  { scope: "rnipp_birthdate", fd: "IDENTITY", label: "Date de naissance" },
  {
    scope: "rnipp_profile",
    fd: "IDENTITY",
    label: "profile provenant du RNIPP",
  },
  {
    scope: "rnipp_birth",
    fd: "IDENTITY",
    label: "Information de naissances provenant du RNIPP",
  },
  {
    scope: "rnipp_identite_pivot",
    fd: "IDENTITY",
    label: "Identité pivot du provenant du RNIPP",
  },

  {
    scope: "dgfip_rfr",
    fd: "DGFIP",
    label:
      "Revenu fiscal de référence (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_annee_n_moins_1",
    fd: "DGFIP",
    label:
      "Dernière année de revenu (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_annee_n_moins_2",
    fd: "DGFIP",
    label:
      "Avant-dernière année de revenu (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_annee_n_moins_3",
    fd: "DGFIP",
    label:
      "Avant-avant-dernière année de revenu (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_nbpart",
    fd: "DGFIP",
    label:
      "Nombre de parts du foyer fiscal (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_sitfam",
    fd: "DGFIP",
    label:
      "Situation de famille (marié, pacsé, célibataire, veuf, divorcé) (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_aft",
    fd: "DGFIP",
    label:
      "Adresse déclarée au 1er Janvier (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_nbpac",
    fd: "DGFIP",
    label:
      "Nombre de personnes à charge (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_inddeficit",
    fd: "DGFIP",
    label:
      "Indicateur de l’existence d’un déficit (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_pariso",
    fd: "DGFIP",
    label: "Parent isolé (case T) (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_decl",
    fd: "DGFIP",
    label:
      "État-civil des déclarants du foyer fiscal (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_pac",
    fd: "DGFIP",
    label:
      "Détail des personnes à charge et rattachées (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_locaux_th",
    fd: "DGFIP",
    label:
      "Données issues de la Taxe d’Habitation (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_nmUsaDec1",
    fd: "DGFIP",
    label: "Nom déclarant 1 (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_nmNaiDec1",
    fd: "DGFIP",
    label:
      "Nom de naissance déclarant 1 (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_prnmDec1",
    fd: "DGFIP",
    label: "Prénom déclarant 1 (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_dateNaisDec1",
    fd: "DGFIP",
    label:
      "Date de naissance déclarant 1 (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_nmUsaDec2",
    fd: "DGFIP",
    label: "Nom déclarant 2 (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_nmNaiDec2",
    fd: "DGFIP",
    label:
      "Nom de naissance déclarant 2 (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_prnmDec2",
    fd: "DGFIP",
    label: "Prénom déclarant 2 (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_dateNaisDec2",
    fd: "DGFIP",
    label:
      "Date de naissance déclarant 2 (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_locaux_th_ident",
    fd: "DGFIP",
    label:
      "Données du local - identifiant du logement (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_locaux_th_Nat",
    fd: "DGFIP",
    label:
      "Données du local – nature (maison, appartement, ect,) (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_locaux_th_Tax",
    fd: "DGFIP",
    label:
      "Données du local - régime de taxation (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_locaux_th_Aff",
    fd: "DGFIP",
    label:
      "Données du local - affectation (« H » pour habitation) (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_pac_nbPac",
    fd: "DGFIP",
    label:
      "Nombre de personnes à charge (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_mntRevbareme",
    fd: "DGFIP",
    label:
      "Montant de l’impôt sur les revenus soumis au barème (ligne 14) (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_indiIFI",
    fd: "DGFIP",
    label: "Indicateur ISF/IFI (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevDecl_Cat1_Tspr",
    fd: "DGFIP",
    label:
      "Catégorie 1 - Salaires, pensions, rentes (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevDecl_Cat1_RentOn",
    fd: "DGFIP",
    label:
      "Catégorie 1 - Rentes viagères à titre onéreux (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevDecl_Cat2_Rcm",
    fd: "DGFIP",
    label:
      "Catégorie 2 - Revenus de capitaux mobiliers (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevDecl_Cat3_PMV",
    fd: "DGFIP",
    label:
      "Catégorie 3 - Plus ou moins values (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevDecl_Cat4_Ref",
    fd: "DGFIP",
    label:
      "Catégorie 4 - Revenus fonciers (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevDecl_Cat5_NonSal",
    fd: "DGFIP",
    label:
      "Catégorie 5 - Revenus des professions non salariées (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevNets_Cat1_Tspr",
    fd: "DGFIP",
    label:
      "Catégorie 1 - Salaires, pensions, rentes (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevNets_Cat1_RentOn",
    fd: "DGFIP",
    label:
      "Catégorie 1 - Rentes viagères à titre onéreux (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevNets_Cat2_Rcm",
    fd: "DGFIP",
    label:
      "Catégorie 2 - Revenus de capitaux mobiliers (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevNets_Cat3_PMV",
    fd: "DGFIP",
    label:
      "Catégorie 3 - Plus ou moins values (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevNets_Cat4_Ref",
    fd: "DGFIP",
    label:
      "Catégorie 4 - Revenus fonciers (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_RevNets_Cat5_NonSal",
    fd: "DGFIP",
    label:
      "Catégorie 5 - Revenus des professions non salariées (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_PaDeduc_EnfMaj",
    fd: "DGFIP",
    label:
      "Pensions alimentaires déductibles - Pension alimentaire versées à enfant majeur (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_PaDeduc_Autres",
    fd: "DGFIP",
    label:
      "Pensions alimentaires déductibles - Autres pensions alimentaires versées (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_EpargRetrDeduc",
    fd: "DGFIP",
    label:
      "Versement épargne retraite (Direction générale des Finances publiques)",
  },
  {
    scope: "dgfip_annee_n_moins_2_si_indispo_n_moins_1",
    fd: "DGFIP",
    label:
      "Avant-dernière année de revenu, si la dernière année de revenu est indisponible (Direction générale des Finances publiques)",
  },

  {
    scope: "droits_assurance_maladie",
    fd: "CNAM",
    label: "Droits assurance maladie (Caisse nationale de l'assurance maladie)",
  },
  {
    scope: "cnam_beneficiaires",
    fd: "CNAM",
    label:
      "Liste de vos ayant-droits (Caisse nationale de l'assurance maladie)",
  },
  {
    scope: "cnam_contrats",
    fd: "CNAM",
    label: "Vos droits de base (Caisse nationale de l'assurance maladie)",
  },
  {
    scope: "cnam_caisse",
    fd: "CNAM",
    label:
      "Votre caisse gestionnaire (Caisse nationale de l'assurance maladie)",
  },
  {
    scope: "cnam_exonerations",
    fd: "CNAM",
    label:
      "Vos exonérations ou modulations éventuelles (Caisse nationale de l'assurance maladie)",
  },
  {
    scope: "cnam_medecin_traitant",
    fd: "CNAM",
    label: "Votre médecin traitant (Caisse nationale de l'assurance maladie)",
  },
  {
    scope: "cnam_presence_medecin_traitant",
    fd: "CNAM",
    label:
      "Présence d’un médecin traitant (Caisse nationale de l'assurance maladie)",
  },
  {
    scope: "cnam_paiements_ij",
    fd: "CNAM",
    label:
      "Paiements d'indemnités journalières versés par l'Assurance Maladie (Caisse nationale de l'assurance maladie)",
  },

  {
    scope: "mi_siv_carte_grise",
    fd: "SIV",
    label:
      "Informations de la carte grise : titulaire et véhicule (Ministère de l'Intérieur)",
  },

  {
    scope: "cnous_statut_boursier",
    fd: "CNOUS",
    label:
      "Statut étudiant boursier (Centre national des œuvres universitaires et scolaires)",
  },
  {
    scope: "cnous_echelon_bourse",
    fd: "CNOUS",
    label:
      "Echelon de la bourse (Centre national des œuvres universitaires et scolaires)",
  },
  {
    scope: "cnous_email",
    fd: "CNOUS",
    label: "E-mail (Centre national des œuvres universitaires et scolaires)",
  },
  {
    scope: "cnous_periode_versement",
    fd: "CNOUS",
    label:
      "Période de versement (Centre national des œuvres universitaires et scolaires)",
  },
  {
    scope: "cnous_statut_bourse",
    fd: "CNOUS",
    label:
      "Statut définitif de la bourse (Centre national des œuvres universitaires et scolaires)",
  },
  {
    scope: "cnous_ville_etudes",
    fd: "CNOUS",
    label:
      "Ville d'étude (Centre national des œuvres universitaires et scolaires)",
  },
  { scope: "cnous_identite", fd: "CNOUS", label: "Identité" },
];

print("Insert scopes");
scopeList.forEach((scope) => {
  db.scopes.updateOne(
    { scope: scope.scope },
    { $set: scope },
    { upsert: true },
  );
});
