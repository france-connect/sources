export interface TicketTracksDataInterface {
  date: string;
  idpName: string;
  spName: string;
  idpSub: string;
  spSub: string;
  platform: string;
  interactionAcr: string;
  city: string;
  country: string;
  ipAddress: string[];
  accountIdMatch: boolean;
}

export interface SecurityTicketDataInterface {
  fraudCaseId: string;
  givenName: string;
  familyName: string;
  birthdate: string;
  birthplace: string;
  birthcountry: string;
  contactEmail: string;
  idpEmail: string;
  authenticationEventId: string;
  fraudSurveyOrigin: string;
  comment?: string;
  phoneNumber?: string;
  error: string;
  total: number;
  tracks: TicketTracksDataInterface[];
}
