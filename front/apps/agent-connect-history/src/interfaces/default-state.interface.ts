/* istanbul ignore file */

// declarative file
import { Dispatch, SetStateAction } from 'react';

export interface DefaultState {
  setUserHistory: Dispatch<SetStateAction<string[]>>;
  userHistory: string[];
  localStorageKey: string;
}
