export const rnippCorectResponseXml = `
<?xml version="1.0" encoding="UTF-8"?>
<el:IdentificationsIndividusCitoyens
  xmlns:n1="http://www.altova.com/samplexml/other-namespace"
  xmlns:ds="http://www.w3.org/2000/09/xmldsig"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:io="http://xml.insee.fr/schema/outils"
  xmlns:ie="http://xml.insee.fr/schema"
  xmlns:ec="http://xml.insee.fr/schema/etat-civil"
  xmlns:el="http://xml.insee.fr/schema/electoral"
  xsi:schemaLocation="http://xml.insee.fr/schema/electoral http://xml.insee.fr/schema/electoral/brpp-client-identification.xsd"
  uriDemande="http://identification-etat-civil.insee.net/individus?rechercheType=S&nom=Dent&prenoms=Arthur%20Philip&dateNaissance=19780308&sexe=m&codeLieuNaissance=42424"
  dateValidite="2015-04-16"
>
  <el:TypeReponseIdentification>2</el:TypeReponseIdentification>
  <el:IdentificationIndividuCitoyen>
    <el:SituationActuelle>
      <ec:Individu>
        <ie:Noms>
          <ie:NomFamille>DUBOIS</ie:NomFamille>
        </ie:Noms>
        <ie:Prenoms>
          <ie:Prenom>Angela Claire Louise</ie:Prenom>
        </ie:Prenoms>
        <ie:Naissance>
          <ie:DateNaissance>1962-08-24</ie:DateNaissance>
            <ie:LieuNaissance>
              <ie:Localite code="75107">Ville</ie:Localite>
            </ie:LieuNaissance>
            <ie:NumeroActeNaissance>614</ie:NumeroActeNaissance>
          </ie:Naissance>
          <ie:Sexe>F</ie:Sexe>
        </ec:Individu>
        <ec:QualiteEtatCivil>ci</ec:QualiteEtatCivil>
      </el:SituationActuelle>
      <el:StatutDuNomIdentifieDansLaDemande>O</el:StatutDuNomIdentifieDansLaDemande>
      <el:Divergences>
        <ec:DivergenceNom>false</ec:DivergenceNom>
        <ec:DivergencePrenoms>false</ec:DivergencePrenoms>
        <ec:DivergenceSexe>false</ec:DivergenceSexe>
        <ec:DivergenceDateNaissance>false</ec:DivergenceDateNaissance>
        <ec:DivergenceLieuNaissance>false</ec:DivergenceLieuNaissance>
        <ec:DivergenceNIR>false</ec:DivergenceNIR>
      </el:Divergences>
    </el:IdentificationIndividuCitoyen>
  </el:IdentificationsIndividusCitoyens>
  `;
