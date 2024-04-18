export interface IdentityProviderBase {
  selectors: {
    password: string;
    loginButton: string;
    username: string;
  };
  url: string;
}

export interface IdentityProvider extends IdentityProviderBase {
  acrValue: string;
  encryption: string;
  signature: string;
  descriptions: string[];
  usable: boolean;
  idpId: string;
  mocked: boolean;
  title: string;
  name: string;
  fqdn?: string;
}
