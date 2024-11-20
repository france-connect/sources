/* istanbul ignore file */

// Declarative code
import { BaseTracksOutputInterface } from './base-tracks-output.interface';

export interface TracksAdapterResultsInterface<
  TOutput extends BaseTracksOutputInterface,
> {
  total: number;
  payload: TOutput[];
}
