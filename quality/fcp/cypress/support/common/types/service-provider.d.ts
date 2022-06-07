export interface ServiceProviderBase {
  // Used with FC Legacy SP only
  clientId?: string;
  mocked: boolean;
  // Used with FC Legacy SP only
  redirectUri?: string;
  selectors: {
    fcButton: string;
    logoutButton: string;
  };
  url: string;
}

export interface ServiceProvider extends ServiceProviderBase {
  acrValue: string;
  authorizeHttpMethod: 'post' | 'get';
  claims: string[];
  name: string;
  scopes: string[];
  descriptions: string[];
  explicitConsent: boolean;
}

export interface ScopeContext {
  scopes: string[];
  type: string;
}
