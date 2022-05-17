import { IClaims } from './claims.interface';
import { ILabelMapping } from './label-mapping.interface';
import { IScopes } from './scopes.interface';

export interface IProvider {
  /* @todo typer çà */
  key: string;
  label: string;
}

export interface IProviderMappings {
  provider: IProvider;
  claims: IClaims;
  labels: ILabelMapping<IClaims>;
  scopes: IScopes;
}
