/* istanbul ignore file */

// declarative file
import { GlobalState } from '@fc/state-management';

import { CounterState } from './interfaces';

// Your state configuration MUST use the GlobalState interface
export const state: GlobalState<CounterState> = {
  /**
   * To be composed later (see application implementation) you need to scope
   * your state with the library name.
   */
  Counter: {
    blacklist: true,
    /**
     * Be sure to define each last level key / array so that your library is ready
     * at start without unwanted crash.
     */
    defaultValue: {
      name: 'Final Countdown 🎵',
      value: 10,
    },
  },
};
