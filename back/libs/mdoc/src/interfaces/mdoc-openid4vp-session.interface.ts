/** OpenID4VP handover inputs used to build the mdoc SessionTranscript. */
export interface MdocOpenid4vpSession {
  readonly clientId: string;
  readonly nonce: string;
  readonly responseUri: string;
}
