# Consumer Account

This consumer is used to retrieve accountId from identityHash.

It listens to the pattern `GET_ACCOUNT_ID` as defined in protocol in [@fc/microservices](../../libs/microservices/src/index.ts).

The payload is an object containing the property `identityHash` and is checked against the [GetAccountIdPayload DTO](src/dto/get-account-id-payload.dto.ts).

The result is either a FSA object containing the accountId as a `string` in the payload or the `ERROR` token in case of failure.
