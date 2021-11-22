export interface ServiceProviderBase {
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
  mocked: boolean;
  name: string;
  scopes: string[];
  descriptions: string[];
  explicitConsent: boolean;
}

export interface ScopeContext {
  scopes: string[];
  type: string;
}
