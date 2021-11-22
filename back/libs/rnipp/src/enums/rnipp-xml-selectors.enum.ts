export enum RnippXmlSelectors {
  GENDER = 'IdentificationsIndividusCitoyens.IdentificationIndividuCitoyen[0].SituationActuelle[0].Individu[0].Sexe[0]',
  FAMILY_NAME = 'IdentificationsIndividusCitoyens.IdentificationIndividuCitoyen[0].SituationActuelle[0].Individu[0].Noms[0].NomFamille[0]',
  GIVEN_NAME = 'IdentificationsIndividusCitoyens.IdentificationIndividuCitoyen[0].SituationActuelle[0].Individu[0].Prenoms[0].Prenom',
  BIRTH_DATE = 'IdentificationsIndividusCitoyens.IdentificationIndividuCitoyen[0].SituationActuelle[0].Individu[0].Naissance[0].DateNaissance[0]',
  BIRTH_PLACE = 'IdentificationsIndividusCitoyens.IdentificationIndividuCitoyen[0].SituationActuelle[0].Individu[0].Naissance[0].LieuNaissance[0].Localite[0].$.code',
  BIRTH_COUNTRY = 'IdentificationsIndividusCitoyens.IdentificationIndividuCitoyen[0].SituationActuelle[0].Individu[0].Naissance[0].LieuNaissance[0].Pays[0].$.code',
  DECEASED = 'IdentificationsIndividusCitoyens.IdentificationIndividuCitoyen[0].SituationActuelle[0].Individu[0].Deces[0]',
  RNIPP_CODE = 'IdentificationsIndividusCitoyens.TypeReponseIdentification[0]',
}
