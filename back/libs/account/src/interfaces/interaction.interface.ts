import { IFederation } from './federation.interface';

export interface IInteraction {
  identityHash: string;
  lastConnection: Date;
  idpFederation: IFederation;
  spFederation: IFederation;
  id?: string;
}
