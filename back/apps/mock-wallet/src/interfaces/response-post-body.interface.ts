import { ErrorPostBodyInterface } from './error-post-body.interface';

export interface JarmPostBodyInterface {
  readonly state?: string;
  readonly response: string;
}

export interface VpTokenPostBodyInterface {
  readonly state?: string;
  readonly vp_token: string;
  readonly presentation_submission: string;
}

export type WalletPostBodyType =
  | JarmPostBodyInterface
  | VpTokenPostBodyInterface
  | ErrorPostBodyInterface;
