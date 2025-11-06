import { KeyLike } from 'crypto';

export interface SignAdapterServiceInterface {
  sign(
    data: string,
    alg: string,
    key?: Uint8Array | KeyLike,
  ): Promise<Uint8Array>;
}
