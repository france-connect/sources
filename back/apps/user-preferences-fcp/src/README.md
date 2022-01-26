# USER PREFERENCES FCP

##

# Folder architecture

**src/index.ts**

- **src/user-preferences-fcp.module.ts**

- **src/controllers**

- **src/services**

- **src/dto**

- **src/interfaces**

# user-preferences-fcp.controller

## getIdpSettings()

The payload is received by RabbitMQ, the application is sync with RabbitMQ
for a specific 'topic', on idp_settings queue. Once a message received match the `GET_IDP_SETTINGS` pattern, it will automatically fire this controller's method with the payload received.
The idpSettings are stored in accounts data, this method find the account related
to the identity, and return the idpSettings object related

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
The idpSettings are stored in accounts data, this method update the account related to the identity with the idpSettings.includeList, and return the updated idpSettings.

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
      "includeList": ["fip1-high", "fip2-high"]
    }
  }
}
```
