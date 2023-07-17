// -- Scopes - set all scopes by types with a description label
print("Add scopes...");
db.scopes.createIndex({ scope: 1 }, { unique: true });

// -- Scopes - IDENTITY
print("Initializing IDENTITY scopes...");
db.scopes.update({ scope: "openid",              }, { scope: "openid",             fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "given_name",          }, { scope: "given_name",         fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "family_name",         }, { scope: "family_name",        fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "preferred_username",  }, { scope: "preferred_username", fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "birthdate",           }, { scope: "birthdate",          fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "gender",              }, { scope: "gender",             fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "birthplace",          }, { scope: "birthplace",         fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "birthcountry",        }, { scope: "birthcountry",       fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "email",               }, { scope: "email",              fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "address",             }, { scope: "address",            fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "phone",               }, { scope: "phone",              fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "profile",             }, { scope: "profile",            fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "birth",               }, { scope: "birth",              fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "identite_pivot",      }, { scope: "identite_pivot",     fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "idp_id",              }, { scope: "idp_id",             fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "idp_birthdate",       }, { scope: "idp_birthdate",      fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });

// --Scope - FranceConnect
print("Initializing FranceConnect scopes...");
db.scopes.update({ scope: "connexion_tracks",    }, { scope: "connexion_tracks",   fd: "FranceConnect", label: "Historique de connexions", __v: 0, }, { upsert: true, });

// -- Scopes - DGFIP
print("Initializing DGFIP scopes...");
db.scopes.update({ scope: "dgfip_rfr",                        }, { scope: "dgfip_rfr",              fd: "DGFIP", label: "Revenu fiscal de référence (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_annee_n_moins_1",            }, { scope: "dgfip_annee_n_moins_1",  fd: "DGFIP", label: "Dernière année de revenu (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_annee_n_moins_2",            }, { scope: "dgfip_annee_n_moins_2",  fd: "DGFIP", label: "Avant-dernière année de revenu (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_annee_n_moins_2",            }, { scope: "dgfip_annee_n_moins_3",  fd: "DGFIP", label: "Avant-avant-dernière année de revenu (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_nbpart",                     }, { scope: "dgfip_nbpart",           fd: "DGFIP", label: "Nombre de parts du foyer fiscal (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_sitfam",                     }, { scope: "dgfip_sitfam",           fd: "DGFIP", label: "Situation de famille (marié, pacsé, célibataire, veuf divorcé) (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_aft",                        }, { scope: "dgfip_aft",              fd: "DGFIP", label: "Adresse déclarée au 1er Janvier (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_nbpac",                      }, { scope: "dgfip_nbpac",            fd: "DGFIP", label: "Nombre de personnes à charge (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_inddeficit",                 }, { scope: "dgfip_inddeficit",       fd: "DGFIP", label: "Indicateur de l’existence d’un déficit (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_pariso",                     }, { scope: "dgfip_pariso",           fd: "DGFIP", label: "Parent isolé (case T) (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_decl",                       }, { scope: "dgfip_decl",             fd: "DGFIP", label: "État-civil des déclarants du foyer fiscal (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_pac",                        }, { scope: "dgfip_pac",              fd: "DGFIP", label: "Détail des personnes à charge et rattachées (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_locaux_th",                  }, { scope: "dgfip_locaux_th",        fd: "DGFIP", label: "Données issues de la Taxe d’Habitation (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_nmUsaDec1",                  }, { scope: "dgfip_nmUsaDec1",        fd: "DGFIP", label: "Nom déclarant 1 (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_nmNaiDec1",                  }, { scope: "dgfip_nmNaiDec1",        fd: "DGFIP", label: "Nom de naissance déclarant 1 (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_prnmDec1",                   }, { scope: "dgfip_prnmDec1",         fd: "DGFIP", label: "Prénom déclarant 1 (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_dateNaisDec1",               }, { scope: "dgfip_dateNaisDec1",     fd: "DGFIP", label: "Date de naissance déclarant 1 (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_nmUsaDec2",                  }, { scope: "dgfip_nmUsaDec2",        fd: "DGFIP", label: "Nom déclarant 2 (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_nmNaiDec2",                  }, { scope: "dgfip_nmNaiDec2",        fd: "DGFIP", label: "Nom de naissance déclarant 2 (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_prnmDec2",                   }, { scope: "dgfip_prnmDec2",         fd: "DGFIP", label: "Prénom déclarant 2 (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_dateNaisDec2",               }, { scope: "dgfip_dateNaisDec2",     fd: "DGFIP", label: "Date de naissance déclarant 2 (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_locaux_th_ident",            }, { scope: "dgfip_locaux_th_ident",  fd: "DGFIP", label: "Données du local - identifiant du logement (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_locaux_th_Nat",              }, { scope: "dgfip_locaux_th_Nat",    fd: "DGFIP", label: "Données du local – nature (maison, appartement, ect,) (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_locaux_th_Tax",              }, { scope: "dgfip_locaux_th_Tax",    fd: "DGFIP", label: "Données du local - régime de taxation (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_locaux_th_Aff',              }, { scope: 'dgfip_locaux_th_Aff',    fd: 'DGFIP', label: "Données du local - affectation (« H » pour habitation) (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_pac_nbPac',                  }, { scope: 'dgfip_pac_nbPac',        fd: 'DGFIP', label: "Nombre de personnes à charge (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_mntRevbareme',               }, { scope: 'dgfip_mntRevbareme',     fd: 'DGFIP', label: "Montant de l’impôt sur les revenus soumis au barème (ligne 14) (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_indiIFI',                    }, { scope: 'dgfip_indiIFI',          fd: 'DGFIP', label: "Indicateur ISF/IFI (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevDecl_Cat1_Tspr',          }, { scope: 'dgfip_RevDecl_Cat1_Tspr',    fd: 'DGFIP', label: "Catégorie 1 - Salaires, pensions, rentes (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevDecl_Cat1_RentOn',        }, { scope: 'dgfip_RevDecl_Cat1_RentOn',  fd: 'DGFIP', label: "Catégorie 1 - Rentes viagères à titre onéreux (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevDecl_Cat2_Rcm',           }, { scope: 'dgfip_RevDecl_Cat2_Rcm',     fd: 'DGFIP', label: "Catégorie 2 - Revenus de capitaux mobiliers (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevDecl_Cat3_PMV',           }, { scope: 'dgfip_RevDecl_Cat3_PMV',     fd: 'DGFIP', label: "Catégorie 3 - Plus ou moins values (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevDecl_Cat4_Ref',           }, { scope: 'dgfip_RevDecl_Cat4_Ref',     fd: 'DGFIP', label: "Catégorie 4 - Revenus fonciers (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevDecl_Cat5_NonSal',        }, { scope: 'dgfip_RevDecl_Cat5_NonSal',  fd: 'DGFIP', label: "Catégorie 5 - Revenus des professions non salariées (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevNets_Cat1_Tspr',          }, { scope: 'dgfip_RevNets_Cat1_Tspr',    fd: 'DGFIP', label: "Catégorie 1 - Salaires, pensions, rentes (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevNets_Cat1_RentOn',        }, { scope: 'dgfip_RevNets_Cat1_RentOn',  fd: 'DGFIP', label: "Catégorie 1 - Rentes viagères à titre onéreux (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevNets_Cat2_Rcm',           }, { scope: 'dgfip_RevNets_Cat2_Rcm',     fd: 'DGFIP', label: "Catégorie 2 - Revenus de capitaux mobiliers (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevNets_Cat3_PMV',           }, { scope: 'dgfip_RevNets_Cat3_PMV',     fd: 'DGFIP', label: "Catégorie 3 - Plus ou moins values (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevNets_Cat4_Ref',           }, { scope: 'dgfip_RevNets_Cat4_Ref',     fd: 'DGFIP', label: "Catégorie 4 - Revenus fonciers (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_RevNets_Cat5_NonSal',        }, { scope: 'dgfip_RevNets_Cat5_NonSal',  fd: 'DGFIP', label: "Catégorie 5 - Revenus des professions non salariées (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_PaDeduc_EnfMaj',             }, { scope: 'dgfip_PaDeduc_EnfMaj',       fd: 'DGFIP', label: "Pensions alimentaires déductibles - Pension alimentaire versées à enfant majeur (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'fip_PaDeduc_Autres',               }, { scope: 'fip_PaDeduc_Autres',         fd: 'DGFIP', label: "Pensions alimentaires déductibles - Autres pensions alimentaires versées (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: 'dgfip_EpargRetrDeduc',             }, { scope: 'dgfip_EpargRetrDeduc',       fd: 'DGFIP', label: "Versement épargne retraite (Direction générale des Finances publiques)", __v: 0, }, { upsert: true, });

// -- Scopes - CNAM
print("Initializing CNAM scopes...");
db.scopes.update({ scope: "ensagri_releve_notes",            }, { scope: "ensagri_releve_notes",           fd: "CNAM", label: "Relevé de notes (Enseignement Agricole) (Caisse nationale de l'assurance maladie)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "droits_assurance_maladie",        }, { scope: "droits_assurance_maladie",       fd: "CNAM", label: "Droits assurance maladie (Caisse nationale de l'assurance maladie)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_beneficiaires",              }, { scope: "cnam_beneficiaires",             fd: "CNAM", label: "Liste de vos ayant-droits (Caisse nationale de l'assurance maladie)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_contrats",                   }, { scope: "cnam_contrats",                  fd: "CNAM", label: "Vos droits de base (Caisse nationale de l'assurance maladie)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_caisse",                     }, { scope: "cnam_caisse",                    fd: "CNAM", label: "Votre caisse gestionnaire (Caisse nationale de l'assurance maladie)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_exonerations",               }, { scope: "cnam_exonerations",              fd: "CNAM", label: "Vos exonérations ou modulations éventuelles (Caisse nationale de l'assurance maladie)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_medecin_traitant",           }, { scope: "cnam_medecin_traitant",          fd: "CNAM", label: "Votre médecin traitant (Caisse nationale de l'assurance maladie)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_presence_medecin_traitant",  }, { scope: "cnam_presence_medecin_traitant", fd: "CNAM", label: "Présence d'un médecin traitant (Caisse nationale de l'assurance maladie)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_paiements_ij",               }, { scope: "cnam_paiements_ij",              fd: "CNAM", label: "Paiements d'indemnités journalières versés par l'Assurance Maladie (Caisse nationale de l'assurance maladie)", __v: 0, }, { upsert: true, });

// -- Scopes - SIV
print("Initializing SIV scopes...");
db.scopes.update({ scope: "mi_siv_carte_grise",              }, { scope: "mi_siv_carte_grise",             fd: "SIV", label: "Informations de la carte grise : titulaire et véhicule (Ministère de l'Intérieur)", __v: 0, }, { upsert: true, });

// -- Scopes - MESRI
print("Initializing MESRI scopes...");
db.scopes.update({ scope: "mesri_identifiant",               }, { scope: "mesri_identifiant",              fd: "MESRI", label: "Identifiant national étudiant (Ministère de l'Enseignement supérieur, de la Recherche et de l'Innovation)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "mesri_inscription_etudiant",      }, { scope: "mesri_inscription_etudiant",     fd: "MESRI", label: "Formation initiale (Ministère de l'Enseignement supérieur, de la Recherche et de l'Innovation)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "mesri_inscription_autre",         }, { scope: "mesri_inscription_autre",        fd: "MESRI", label: "Formation continue (Ministère de l'Enseignement supérieur, de la Recherche et de l'Innovation)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "mesri_admission",                 }, { scope: "mesri_admission",                fd: "MESRI", label: "Admission (Ministère de l'Enseignement supérieur, de la Recherche et de l'Innovation)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "mesri_etablissements",            }, { scope: "mesri_etablissements",           fd: "MESRI", label: "Établissements (Ministère de l'Enseignement supérieur, de la Recherche et de l'Innovation)", __v: 0, }, { upsert: true, });

// -- Scopes - CNOUS
print("Initializing CNOUS scopes...");
db.scopes.update({ scope: "cnous_statut_boursier",           }, { scope: "cnous_statut_boursier",          fd: "CNOUS", label: "Statut boursier (Centre national des œuvres universitaires et scolaires)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnous_echelon_bourse",            }, { scope: "cnous_echelon_bourse",           fd: "CNOUS", label: "Echelon de la bourse (Centre national des œuvres universitaires et scolaires)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnous_email",                     }, { scope: "cnous_email",                    fd: "CNOUS", label: "Courriel (Centre national des œuvres universitaires et scolaires)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnous_periode_versement",         }, { scope: "cnous_periode_versement",        fd: "CNOUS", label: "Période de versement (Centre national des œuvres universitaires et scolaires)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnous_statut_bourse",             }, { scope: "cnous_statut_bourse",            fd: "CNOUS", label: "Statut définitif de la bourse (Centre national des œuvres universitaires et scolaires)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnous_ville_etudes",              }, { scope: "cnous_ville_etudes",             fd: "CNOUS", label: "Ville d'étude (Centre national des œuvres universitaires et scolaires)", __v: 0, }, { upsert: true, });

// -- Scopes - Pôle emploi
print("Initializing Pôle emploi scopes...");
db.scopes.update({ scope: "api_fc-liste-paiementsv1",        }, { scope: "api_fc-liste-paiementsv1",       fd: "Pôle emploi", label: "Indemnités de Pôle emploi (Pôle emploi)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "api_fc-statutaugmentev1",         }, { scope: "api_fc-statutaugmentev1",        fd: "Pôle emploi", label: "Statut demandeur d'emploi (Pôle emploi)", __v: 0, }, { upsert: true, });
