/* istanbul ignore file */

// Declarative code
import { IPaginationResult } from '@fc/common';

import { TracksOutputInterface } from './tracks-output.interface';

export interface TracksResultsInterface {
  meta: IPaginationResult;
  payload: TracksOutputInterface[];
}
