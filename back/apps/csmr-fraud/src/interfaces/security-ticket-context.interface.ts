import { TrackingDataDto } from '@fc/csmr-fraud-client';

import { SecurityTicketDataInterface } from './security-ticket-data.interface';

export interface SecurityTicketContextInterface {
  ticketData: SecurityTicketDataInterface;
  trackingData: TrackingDataDto;
}
