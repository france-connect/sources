/* istanbul ignore file */

// Declarative code
import { ICsmrTracksLegacyTrack } from '../interfaces';

export const ACTIONS_TO_INCLUDE: Partial<ICsmrTracksLegacyTrack>[] = [
  {
    action: 'authentication',
    // Legacy property name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    type_action: 'initial',
  },
  {
    action: 'consent',
    // Legacy property name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    type_action: 'demandeIdentity',
  },
  {
    action: 'consent',
    // Legacy property name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    type_action: 'demandeData',
  },
  {
    action: 'checkedToken',
    // Legacy property name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    type_action: 'verification',
  },
];
