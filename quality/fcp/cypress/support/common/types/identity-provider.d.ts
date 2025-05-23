export interface IdentityProviderBase {
  selectors: {
    idpButton: string;
    password: string;
    loginButton: string;
    username: string;
  };
  url: string;
}

export interface IdentityProviderInterface extends IdentityProviderBase {
  acrValue: string;
  encryption: string;
  signature: string;
  descriptions: string[];
  usable: boolean;
  idpId: string;
  name: string;
  title: string;
  mocked: boolean;
}
