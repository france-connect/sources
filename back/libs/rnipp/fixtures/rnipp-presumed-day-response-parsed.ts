export const rnippPresumedDayResponseParsed = {
  IdentificationsIndividusCitoyens: {
    $: {
      'xmlns:n1': 'http://www.altova.com/samplexml/other-namespace',
      'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:io': 'http://xml.insee.fr/schema/outils',
      'xmlns:ie': 'http://xml.insee.fr/schema',
      'xmlns:ec': 'http://xml.insee.fr/schema/etat-civil',
      'xmlns:el': 'http://xml.insee.fr/schema/electoral',
      'xsi:schemaLocation':
        'http://xml.insee.fr/schema/electoral http://xml.insee.fr/schema/electoral/brpp-client-identification.xsd',
      uriDemande:
        'http://identification-etat-civil.insee.net/individus?rechercheType=S&nom=Dent&prenoms=Arthur%20Philip&dateNaissance=19780308&sexe=m&codeLieuNaissance=42424',
      dateValidite: '2015-04-16',
    },
    TypeReponseIdentification: ['2'],
    IdentificationIndividuCitoyen: [
      {
        SituationActuelle: [
          {
            Individu: [
              {
                Noms: [{ NomFamille: ['DUBOIS'] }],
                Prenoms: [{ Prenom: ['Angela', 'Claire', 'Louise'] }],
                Naissance: [
                  {
                    DateNaissance: ['1962-08'],
                    LieuNaissance: [
                      {
                        Localite: [
                          {
                            _: 'Ville',
                            $: { code: '75107' },
                          },
                        ],
                      },
                    ],
                    NumeroActeNaissance: ['614'],
                  },
                ],
                Sexe: ['F'],
              },
            ],
            QualiteEtatCivil: ['ci'],
          },
        ],
        StatutDuNomIdentifieDansLaDemande: ['O'],
        Divergences: [
          {
            DivergenceNom: ['false'],
            DivergencePrenoms: ['false'],
            DivergenceSexe: ['false'],
            DivergenceDateNaissance: ['false'],
            DivergenceLieuNaissance: ['false'],
            DivergenceNIR: ['false'],
          },
        ],
      },
    ],
  },
};
