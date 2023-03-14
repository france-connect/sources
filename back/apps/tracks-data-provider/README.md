# Tracks Data Provider

## About

This application provides a log of connections for a user through FranceConnect and FranceConnect+. The application behave like any other data provider of the FranceConnect ecosystem.

Only the connection history related to one given identity are retrievable at a time.

## Usage

### 1. Obtain a token from FranceConnect

Connection to FC with scope `connexion_tracks`
You must have an authorized service provider application to retrieve an access token from

```shell
curl -k  https://.../api/v1/token -H 'content-type': 'application/x-www-form-urlencoded' -d '<encodedbody>'
```

To retrieve the token you can find the needed informations to call the endpoint in the [FranceConnect documentation](https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service)

### 2. Call data provider endpoint

Call endpoint with received token

```shell
curl -k  https://.../data/v1/connexion_tracks -H 'Authorization: Bearer <token>'
```

### 3. Outputs

We retrieve the last FranceConnect and FranceConnect+ events (connections, data exchanges, authorization) in a chronological sequence. A maximum of 500 events are retrieved.

[CSMR-TRACKS documentation](../../apps/csmr-tracks/README.md#output)
