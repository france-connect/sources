# CSMR USER PREFERENCES

##

# Folder architecture

**src/index.ts**

- **src/csmr-user-preferences.module.ts**

- **src/controllers**

- **src/services**

- **src/dto**

- **src/interfaces**

# csmr-user-preferences.controller

## getIdpSettings()

The payload is received by RabbitMQ, the application is sync with RabbitMQ
for a specific 'topic', on idp_settings queue. Once a message received match the `GET_IDP_SETTINGS` pattern, it will automatically fire this controller's method with the payload received.
IdpSettings are stored in accounts data, this method finds the account related to the identity, and returns the idpSettings object related

The Payload can be tested here: http://localhost:15673/#/queues/%2F/idp_settings

Example :

```json
{
  "pattern": "GET_IDP_SETTINGS",
  "data": {
    "identity": {
      "sub": "foo",
      "given_name": "Angela Claire Louise",
      "family_name": "DUBOIS",
      "birthdate": "1962-08-24",
      "gender": "female",
      "preferred_username": "",
      "birthcountry": "99100",
      "birthplace": "75107",
      "email": "wossewodda-3728@yopmail.com",
      "phone_number": "123456789",
      "address": {
        "country": "France",
        "formatted": "France Paris 75107 20 avenue de Ségur",
        "locality": "Paris",
        "postal_code": "75107",
        "street_address": "20 avenue de Ségur"
      }
    }
  }
}
```

## setIdpSettings()

The payload is received by RabbitMQ, the application is sync with RabbitMQ
for a specific 'topic', on idp_settings queue. Once a message received match the `SET_IDP_SETTINGS` pattern, it will automatically fire this controller's method with the payload received.
IdpSettings are stored in accounts data, this method updates the account related to the identity with the idpSetting, and returns the updated idpSettings.

The Payload can be tested here: http://localhost:15673/#/queues/%2F/idp_settings

```json
{
  "pattern": "SET_IDP_SETTINGS",
  "data": {
    "identity": {
      "sub": "foo",
      "given_name": "Angela Claire Louise",
      "family_name": "DUBOIS",
      "birthdate": "1962-08-24",
      "gender": "female",
      "preferred_username": "",
      "birthcountry": "99100",
      "birthplace": "75107",
      "email": "wossewodda-3728@yopmail.com",
      "phone_number": "123456789",
      "address": {
        "country": "France",
        "formatted": "France Paris 75107 20 avenue de Ségur",
        "locality": "Paris",
        "postal_code": "75107",
        "street_address": "20 avenue de Ségur"
      }
    },
    "idpSettings": {
      "idpList": ["fip1-high", "fip2-high"],
      "allowFutureIdp": true
    }
  }
}
```

The idpSettings properties will be transformed into two variables in order to be stored in database and prevent the identity providers that can be added in the future: isExcludeList and identityProviderList.
The logic behind these variables is the following :

- _isExcludeList_ is a boolean and defines if the identityProviderList related is either an exclude list or an inclusive list.
- _identityProviderList_ stores a list of identity provider uid.

For example, assume identityProviderList is represented by [1, 2, 3, 4]. If we want to select the number 1 and 2, and get the future idp, we should use an exclude list. The result here will be : identityProviderList = [3, 4] and
isExcludeList = true. It means it will return all elements of the array except 3 and 4 (so [1, 2]). If the array becomes [1, 2, 3, 4, 5], it will returns [1, 2, 5] (5 represents an idp we would have in the future when comparing to the initial situation).

Assume now we don't want to allow future idp in our preferences, we should use an inclusive list. The result will be identityProviderList = [1, 2] and isExcludeList = false. It means you will return all elements in the array that matches the elements of identityProviderList, so [1, 2]. If the array becomes [1, 2, 3, 4, 5], it will still return [1, 2] (5 represents an idp we would have in the future when comparing to the initial situation).
