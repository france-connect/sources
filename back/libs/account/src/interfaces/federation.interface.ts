interface IFederationEntry {
  sub: string;
}

export interface IFederation {
  [key: string]: IFederationEntry;
}

export interface IIdpSettings {
  updatedAt: Date;
  includeList: string[];
}
