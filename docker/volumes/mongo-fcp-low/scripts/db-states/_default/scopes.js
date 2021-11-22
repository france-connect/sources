// -- Scopes - set all scopes by types with a description label
print("Add scopes...");
db.scopes.createIndex({ scope: 1 }, { unique: true });

// -- Scopes - IDENTITY
print("Initializing IDENTITY scopes...");
db.scopes.update({ scope: "openid",              }, { scope: "openid",             fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "given_name",          }, { scope: "given_name",         fd: "IDENTITY", label: "Prénom(s)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "family_name",         }, { scope: "family_name",        fd: "IDENTITY", label: "Nom de naissance", __v: 0, }, { upsert: true, });
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

// -- Scopes - DGFIP
print("Initializing DGFIP scopes...");
db.scopes.update({ scope: "dgfip_rfr",                        }, { scope: "dgfip_rfr",              fd: "DGFIP", label: "Revenu fiscal de référence (DGFIP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_annee_n_moins_1",            }, { scope: "dgfip_annee_n_moins_1",  fd: "DGFIP", label: "Dernière année de revenu (DGFIP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_annee_n_moins_2",            }, { scope: "dgfip_annee_n_moins_2",  fd: "DGFIP", label: "Avant-dernière année de revenu (DGFIP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_nbpart",                     }, { scope: "dgfip_nbpart",           fd: "DGFIP", label: "Nombre de parts du foyer fiscal (DGFIP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_sitfam",                     }, { scope: "dgfip_sitfam",           fd: "DGFIP", label: "Situation familiale (DGFIP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_aft",                        }, { scope: "dgfip_aft",              fd: "DGFIP", label: "Adresse fiscale de taxation (DGFIP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_nbpac",                      }, { scope: "dgfip_nbpac",            fd: "DGFIP", label: "Nombre de personnes à charge (DGFIP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_inddeficit",                 }, { scope: "dgfip_inddeficit",       fd: "DGFIP", label: "Existence d'un déficit antérieur (DGFIP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_pariso",                     }, { scope: "dgfip_pariso",           fd: "DGFIP", label: "Indicateur de situation « parent isolé » (DGFIP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_decl",                       }, { scope: "dgfip_decl",             fd: "DGFIP", label: "État-civil des déclarants du foyer fiscal (DGFiP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_pac",                        }, { scope: "dgfip_pac",              fd: "DGFIP", label: "Nombre et détail des personnes à charge (DGFIP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_locaux_th",                  }, { scope: "dgfip_locaux_th",        fd: "DGFIP", label: "Données issues de la Taxe d’Habitation (DGFiP)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "dgfip_revenu_fiscal_de_reference", }, { scope: "dgfip_locaux_th",        fd: "DGFIP", label: "Revenu fiscal de référence (DGFiP)", __v: 0, }, { upsert: true, });

// -- Scopes - CNAM
print("Initializing CNAM scopes...");
db.scopes.update({ scope: "ensagri_releve_notes",            }, { scope: "ensagri_releve_notes",           fd: "CNAM", label: "Relevé de notes (Enseignement Agricole)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "droits_assurance_maladie",        }, { scope: "droits_assurance_maladie",       fd: "CNAM", label: "Droits assurance maladie (CNAM)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_beneficiaires",              }, { scope: "cnam_beneficiaires",             fd: "CNAM", label: "Liste de vos ayant-droits (CNAM)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_contrats",                   }, { scope: "cnam_contrats",                  fd: "CNAM", label: "Vos droits de base (CNAM)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_caisse",                     }, { scope: "cnam_caisse",                    fd: "CNAM", label: "Votre caisse gestionnaire (CNAM)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_exonerations",               }, { scope: "cnam_exonerations",              fd: "CNAM", label: "Vos exonérations ou modulations éventuelles (CNAM)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_medecin_traitant",           }, { scope: "cnam_medecin_traitant",          fd: "CNAM", label: "Votre médecin traitant (CNAM)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_presence_medecin_traitant",  }, { scope: "cnam_presence_medecin_traitant", fd: "CNAM", label: "Présence d'un médecin traitant (CNAM)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "cnam_paiements_ij",               }, { scope: "cnam_paiements_ij",              fd: "CNAM", label: "Paiements d'indemnités journalières versés par l'Assurance Maladie (CNAM)", __v: 0, }, { upsert: true, });

// -- Scopes - SIV
db.scopes.update({ scope: "mi_siv_carte_grise",              }, { scope: "mi_siv_carte_grise",             fd: "SIV", label: "Informations de la carte grise : titulaire et véhicule (SIV)", __v: 0, }, { upsert: true, });
