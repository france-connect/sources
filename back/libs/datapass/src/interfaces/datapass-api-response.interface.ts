import { DatapassEidasLevels } from '../enums';
import { TechnicalContact } from './datapass-payload.interface';

export interface DatapassApiResponseDataInterface extends TechnicalContact {
  intitule: string;
  scopes: string;
  france_connect_eidas: DatapassEidasLevels;
}

export interface DatapassApiResponseHabilitationInterface {
  id: number;
  state: string;
  authorization_request_class: string;
  revoked: boolean;
}

export interface DatapassApiResponseOrganisationInterface {
  id: number;
  siret: string;
  insee_payload: {
    etablissement: {
      uniteLegale: {
        denominationUniteLegale?: string | null;
      };
    };
  };
}

export interface DatapassApiResponseApplicantInterface {
  email: string;
  given_name: string;
  family_name: string;
}

export type DatapassFilterableItemInterface = Pick<
  DatapassApiResponseInterface,
  'last_validated_at'
> & {
  data: Pick<DatapassApiResponseDataInterface, 'france_connect_eidas'>;
};

export interface DatapassApiResponseInterface {
  id: number;
  public_id: string;
  state: string;
  form_uid: string;
  last_validated_at: string;
  data: DatapassApiResponseDataInterface;
  habilitations: DatapassApiResponseHabilitationInterface[];
  organisation: DatapassApiResponseOrganisationInterface;
  applicant: DatapassApiResponseApplicantInterface;
}
