import { Flows, MockWalletRoutes } from '../enums';
import { WalletIdentityAttributes } from './identity.interface';

export interface SelectableIdentity {
  readonly index: number;
  readonly docType: string;
  readonly attributes: WalletIdentityAttributes;
}

export interface IdentitySelectViewModel {
  readonly url: string;
  readonly flow: Flows;
  readonly authorizeUrl: MockWalletRoutes;
  readonly identities: SelectableIdentity[];
}
