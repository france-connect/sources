export interface ParsedDeepLink {
  readonly requestUri: string;
  readonly requestUriMethod?: string;
  readonly clientId: string;
  readonly state?: string;
  readonly responseType: string;
}
