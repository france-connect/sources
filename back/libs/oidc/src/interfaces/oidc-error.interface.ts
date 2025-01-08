export interface OidcError {
  readonly error: string;
  readonly error_description?: string;
  readonly state?: string;
}
