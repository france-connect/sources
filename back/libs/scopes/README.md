# Scopes Module

This module exposes :

- a service to retrieve informations about scopes and claims.
- the definitions of scopes and claims, for each data providers, including FranceConnect's cores, allowing static usage in applications configuration.

This place for storing shared data is debatable but it is the current implementation.

The definitions are stored in the [data](./src/data/) folder.

## Public API

The service exposes two methods :

- **getRawClaimsFromScopes**

  ```ts
  ScopesService.getRawClaimsFromScopes(scopes: IScope[]): IClaim[]
  ```

  To retrieve "raw" claims, a list of claim identifier strings, from scopes  
  _exemple: `openid`, `birthplace`, etc._

- **getRichClaimsFromScopes**

  ```ts
  ScopesService.getRichClaimsFromScopes(scopes: IScope[]): IClaim[]
  ```

  To retrieve "rich" claims, a list of object containing more information about a claim, from scopes.
  _exemple:_

- **getRichClaimsFromClaims**

  ```ts
  ScopesService.getRichClaimsFromClaims(claims: IClaim[]): IRichClaim[]
  ```

  To retrieve "rich" claims, a list of object containing more information about a claim, from raw claims.
  _exemple:_

  ```ts
  {
    identifier: "given_name",
    label: "Prénom(s)",
    dataProvider: {
      identifier: "FCP_LEGACY",
      label: "FranceConnect"
  }
  ```

- **getScopesFromDatapassScopes**

  ```ts
  ScopesService.getScopesFromDatapassScopes(platformName: PartnersPlatformEnum, datapassScopes: IScope[]): IScope[]
  ```

  To retrieve the complete list of scopes granted by a DataPass authorization, for the FranceConnect core behind a partners platform (`FRANCE_CONNECT_LOW` or `FRANCE_CONNECT_HIGH`).

  DataPass scopes do not follow the FranceConnect definitions: a DataPass scope may not have the same meaning, nor the same correspondence, as the FranceConnect scope bearing the same name. The optional `datapassScopeMapping` of a provider, next to `claims` and `scopes`, catches up those scopes by declaring which FranceConnect scopes each DataPass scope actually stands for:

  ```ts
  // data/fcp-low/datapass-fc-low-scope.mapping.ts
  export const datapassFcLowScopeMapping: DatapassScopeMappingInterface = {
    birthdate: ['birthdate', 'idp_birthdate'],
  };
  ```

  A DataPass scope missing from the mapping is used as the FranceConnect scope of the same name. A new divergence is a new entry in the mapping, not a new condition in the code.

## Configuration

The service needs to be configured, to know wich `scopes` and `claims` are available in the application.

A complex example can be seen in [`csmr-tracks` configuration](../../instances/csmr-tracks/src/config/scopes.ts).

## Internals

This module has to store data with some constraints:

- The lookups at runtime should be fast
- The data should be easy to maintain
- We need to do the lookups by the "leafs" of the data structure (the `claims`)

In the context of hard coded values, the two first constraints are antagonists as a fast index will contain a lot of duplicated informations to avoid runtime lookups.

The solution of this implementation is to take a human oriented data structure, and derive a lookup optimized index from it.

There are actually two genreated indexes, the first to get the `claims` for a given `scope`, the second to get more information for a given `claim`.

## Generated index example (extract from `csmr-tracks`')

### Provider identifier grouped claims

The table below provides a clear view of the technical keys used by the library (named `Grouped claims identifier`), along with the corresponding data provider names and slug"

| Slug     | Grouped claims identifier | Provider Label                                                            |
| -------- | ------------------------- | ------------------------------------------------------------------------- |
| ANTS     | ants                      | Agence Nationale des Titres Sécurisés                                     |
| CNAF_MSA | cnafMsa                   | Caisse nationale des allocations familiales & Mutualité sociale agricole  |
| CNAM     | cnam                      | Caisse nationale de l’assurance maladie                                   |
| CNOUS    | cnous                     | Centre national des œuvres universitaires et scolaires                    |
| DESK     | desk                      | Gestion d'accès - La Suite numérique                                      |
| DGFIP    | dgfip                     | Direction générale des Finances publiques                                 |
| DSS      | dss                       | Sécurité Sociale                                                          |
| fCP_HIGH | fcpHigh                   | FranceConnect+                                                            |
| fCP_LOW  | fcpLow                    | FranceConnect                                                             |
| FT       | ft                        | France Travail                                                            |
| MESRI    | mesri                     | Ministère de l’Enseignement supérieur, de la Recherche et de l’Innovation |
| MI       | mi                        | Ministère de l’Intérieur                                                  |
| DSNJ     | dsnj                      | Direction du Service National et de la Jeunesse                           |

### `claimIndex`

```json
{
  "openid": {
    "identifier": "openid",
    "label": "sub",
    "dataProvider": {
      "identifier": "FCP_LEGACY",
      "label": "FranceConnect"
    }
  },
  "given_name": {
    "identifier": "given_name",
    "label": "Prénom(s)",
    "dataProvider": {
      "identifier": "FCP_LEGACY",
      "label": "FranceConnect"
    }
  },
  "family_name": {
    "identifier": "family_name",
    "label": "Nom de famille",
    "dataProvider": {
      "identifier": "FCP_LEGACY",
      "label": "FranceConnect"
    }
  },

  // [...]

  "mi_siv_carte_grise": {
    "identifier": "mi_siv_carte_grise",
    "label": "Informations de la carte grise: Titulaire et véhicule (Ministère de l’Intérieur)",
    "dataProvider": {
      "identifier": "MI",
      "label": "Ministère de l’Intérieur"
    }
  },
  "api_fc-liste-paiementsv1": {
    "identifier": "api_fc-liste-paiementsv1",
    "label": "Indemnités de Pôle emploi ou Montants et dates des paiements France Travail",
    "dataProvider": {
      "identifier": "FT",
      "label": "France Travail"
    }
  },
  "api_fc-statutaugmentev1": {
    "identifier": "api_fc-statutaugmentev1",
    "label": "Statut demandeur d’emploi ou Statut demandeur d’emploi et identité",
    "dataProvider": {
      "identifier": "FT",
      "label": "France Travail"
    }
  }
}
```

### `scopeIndex`

```json
{
     "openid": [
       "openid"
     ],
     "profile": [
       "given_name",
       "family_name",
       "birthdate",
       "gender",
       "preferred_username"
     ],
     "phone": [
       "phone_number"
     ],
     "birth": [
       "birthplace",
       "birthcountry"
     ],
     "identite_pivot": [
       "given_name",
       "family_name",
       "birthdate",
       "gender",
       "birthplace",
       "birthcountry"
     ],

     // [...]

     "mi_siv_carte_grise": [
       "mi_siv_carte_grise"
     ],
     "api_fc-liste-paiementsv1": [
       "api_fc-liste-paiementsv1"
     ],
     "api_fc-statutaugmentev1": [
       "api_fc-statutaugmentev1"
     ]
   }
 }
```
