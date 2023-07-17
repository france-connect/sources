import { IFederation } from './federation.interface';

export interface IInteraction {
  identityHash: string;
  lastConnection: Date;
  spFederation: IFederation;
  id?: string;
}
