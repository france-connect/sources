export interface ServiceProviderBase {
  selectors: {
    fcaButton: string;
    logoutButton: string;
  };
  url: string;
}

export interface ServiceProvider extends ServiceProviderBase {
  acrValue: string;
  authorizeHttpMethod: 'post' | 'get';
  mocked: boolean;
  name: string;
  descriptions: string[];
}

export interface ScopeContext {
  scopes: string[];
  type: string;
}
