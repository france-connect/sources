import { SanitizedTrackDto } from '@fc/csmr-fraud-client';

import {
  FraudConnectionSessionDto,
  FraudContactSessionDto,
  FraudDescriptionSessionDto,
  FraudIdentitySessionDto,
} from '../dto';

export interface FraudSummaryResponseInterface {
  description: FraudDescriptionSessionDto;
  connection: FraudConnectionSessionDto;
  fraudTracks: SanitizedTrackDto[];
  identity: FraudIdentitySessionDto;
  contact: FraudContactSessionDto;
}
