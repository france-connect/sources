export interface ServiceProviderBase {
  clientId?: string;
  mocked: boolean;
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
  prompt?: string;
}

export interface ScopeContext {
  scopes: string[];
  type: string;
}
