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
    "label": "Nom de naissance",
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
    "label": "Indemnités de Pôle emploi (Pôle emploi)",
    "dataProvider": {
      "identifier": "PE",
      "label": "Pôle emploi"
    }
  },
  "api_fc-statutaugmentev1": {
    "identifier": "api_fc-statutaugmentev1",
    "label": "Statut demandeur d’emploi (Pôle emploi)",
    "dataProvider": {
      "identifier": "PE",
      "label": "Pôle emploi"
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

     "mesri_inscription_autre": [
       "mesri_inscription_autre"
     ],
     "mesri_admission": [
       "mesri_admission"
     ],
     "mesri_etablissements": [
       "mesri_etablissements"
     ],
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
