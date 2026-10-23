import type { HttpClientConfig } from '@fc/http-client';

// @NOTE apiCsrfURL is omitted for now: until the login system is in place,
// the csrf-token route does not exist on the back, so the token is not fetched
export const HttpClient: Omit<HttpClientConfig, 'apiCsrfURL'> = {};
