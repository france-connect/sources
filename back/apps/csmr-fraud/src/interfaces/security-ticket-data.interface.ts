import { TracksTicketDataInterface } from './tracks-results.interface';

export interface SecurityTicketDataInterface {
  givenName: string;
  familyName: string;
  birthdate: string;
  birthplace: string;
  birthcountry: string;
  contactEmail: string;
  idpEmail: string;
  authenticationEventId: string;
  fraudSurveyOrigin: string;
  comment: string;
  phoneNumber: string;
  error: string;
  total: number;
  tracks: TracksTicketDataInterface[];
}
