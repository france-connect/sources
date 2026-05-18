interface DatapassAuthorizationInterface {
  id: string;
  data: Record<string, unknown>;
  [key: string]: unknown;
}

export interface DatapassEvent {
  data: {
    id: string;
    data: Record<string, unknown>;
    applicant: Record<string, unknown>;
    organization: Record<string, unknown>;
    authorizations: DatapassAuthorizationInterface[];
  };
}
