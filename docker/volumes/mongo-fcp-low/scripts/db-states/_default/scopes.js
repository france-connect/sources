// -- Scopes - set all scopes by types with a description label
print("Add scopes...");
db.scopes.createIndex({ scope: 1 }, { unique: true });

// -- Scopes - IDENTITY
print("Initializing IDENTITY scopes...");

const scopeList = [
  { scope: "openid", fd: "IDENTITY", label: "" },
  { scope: "given_name", fd: "IDENTITY", label: "" },
  { scope: "family_name", fd: "IDENTITY", label: "" },
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
  { scope: "idp_id", fd: "IDENTITY", label: "" },
  { scope: "idp_birthdate", fd: "IDENTITY", label: "" },
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
      "Paiements d’indemnités journalières versées par l’Assurance Maladie (Caisse nationale de l'assurance maladie)",
  },
  {
    scope: "mi_siv_carte_grise",
    fd: "SIV",
    label:
      "Informations de la carte grise : titulaire et véhicule (Ministère de l'Intérieur)",
  },
  {
    scope: "mesri_identite",
    fd: "MESRI",
    label:
      "Identité de l’étudiant (Ministère de l'Enseignement supérieur, de la Recherche et de l'Innovation)",
  },
  {
    scope: "mesri_admissions",
    fd: "MESRI",
    label: "Liste des admissions de l’étudiant",
  },
  {
    scope: "mesri_admission_inscrit",
    fd: "MESRI",
    label:
      "Pour chacune des admissions retournées, indique si le statut de l’étudiant est passé à inscrit",
  },
  {
    scope: "mesri_admission_regime_formation",
    fd: "MESRI",
    label: "Régime de formation",
  },
  {
    scope: "mesri_admission_commune_etudes",
    fd: "MESRI",
    label: "Code COG Insee de la commune de l’établissement",
  },
  {
    scope: "mesri_admission_etablissement_etude",
    fd: "MESRI",
    label: "Appellation et code UAI de l’établissement",
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
  {
    scope: "cnous_identite",
    fd: "CNOUS",
    label: "Identité",
  },
  {
    scope: "api_fc-liste-paiementsv1",
    fd: "France Travail",
    label:
      "Indemnités de Pôle emploi ou Montants et dates des paiements France Travail (France Travail)",
  },
  {
    scope: "api_fc-statutaugmentev1",
    fd: "France Travail",
    label: "Statut demandeur d'emploi (France Travail)",
  },
  {
    scope: "allocation_adulte_handicape",
    fd: "CNAF & MSA",
    label:
      "Statut bénéficiaire AAH (Caisse nationale des allocations familiales & Mutualité sociale agricole)",
  },
  {
    scope: "allocation_soutien_familial",
    fd: "CNAF & MSA",
    label:
      "Statut bénéficiaire ASF (Caisse nationale des allocations familiales & Mutualité sociale agricole)",
  },
  {
    scope: "prime_activite",
    fd: "CNAF & MSA",
    label:
      "Statut bénéficiaire prime d’activité (Caisse nationale des allocations familiales & Mutualité sociale agricole)",
  },
  {
    scope: "prime_activite_majoration",
    fd: "CNAF & MSA",
    label:
      "Statut bénéficiaire majoration (Caisse nationale des allocations familiales & Mutualité sociale agricole)",
  },
  {
    scope: "revenu_solidarite_active",
    fd: "CNAF & MSA",
    label:
      "Statut bénéficiaire RSA (Caisse nationale des allocations familiales & Mutualité sociale agricole)",
  },
  {
    scope: "revenu_solidarite_active_majoration",
    fd: "CNAF & MSA",
    label:
      "Statut bénéficiaire majoration (Caisse nationale des allocations familiales & Mutualité sociale agricole)",
  },
  {
    scope: "cnaf_quotient_familial",
    fd: "CNAF & MSA",
    label:
      "Quotient familial CAF & MSA et composition familiale (Caisse nationale des allocations familiales & Mutualité sociale agricole)",
  },
  {
    scope: "cnaf_allocataires",
    fd: "CNAF & MSA",
    label:
      "Identités allocataire et conjoint (Caisse nationale des allocations familiales & Mutualité sociale agricole)",
  },
  {
    scope: "cnaf_enfants",
    fd: "CNAF & MSA",
    label:
      "Identités enfants (Caisse nationale des allocations familiales & Mutualité sociale agricole)",
  },
  {
    scope: "cnaf_adresse",
    fd: "CNAF & MSA",
    label:
      "Adresse du foyer (Caisse nationale des allocations familiales & Mutualité sociale agricole)",
  },
  {
    scope: "complementaire_sante_solidaire",
    fd: "DSS",
    label: "Statut bénéficiaire C2S (Sécurité sociale)",
  },
  {
    scope: "dsnj_statut_service_national",
    fd: "DSNJ",
    label:
      "Statut Service National (Direction du Service National et de la Jeunesse)",
  },
  {
    scope: "ants_extrait_immatriculation_vehicule_identite_particulier",
    fd: "ANTS",
    label: "Identité particulier (Agence Nationale des Titres Sécurisés)",
  },
  {
    scope: "ants_extrait_immatriculation_vehicule_adresse_particulier",
    fd: "ANTS",
    label: "Adresse particulier (Agence Nationale des Titres Sécurisés)",
  },
  {
    scope: "ants_extrait_immatriculation_vehicule_statut_rattachement",
    fd: "ANTS",
    label: "Statut Rattachement (Agence Nationale des Titres Sécurisés)",
  },
  {
    scope:
      "ants_extrait_immatriculation_vehicule_donnees_immatriculation_vehicule",
    fd: "ANTS",
    label:
      "Données immatriculation véhicule (Agence Nationale des Titres Sécurisés)",
  },
  {
    scope:
      "ants_extrait_immatriculation_vehicule_caracteristiques_techniques_vehicule",
    fd: "ANTS",
    label:
      "Caractéristiques techniques véhicule (Agence Nationale des Titres Sécurisés)",
  },
];

print("Insert scopes");
scopeList.forEach((scope) => {
  console.log(scope);
  db.scopes.updateOne(
    { scope: scope.scope },
    { $set: scope },
    { upsert: true },
  );
});
