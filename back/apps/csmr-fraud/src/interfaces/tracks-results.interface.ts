export interface TracksTicketDataInterface {
  date: string;
  idpName: string;
  spName: string;
  idpSub: string;
  spSub: string;
  accountIdMatch: boolean;
  platform: string;
  interactionAcr: string;
  country: string;
  city: string;
  ipAddress: string[];
}

export interface TracksResultsInterface {
  tracks: TracksTicketDataInterface[];
  error: string;
  total: number;
}
