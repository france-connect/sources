interface IFederationEntry {
  sub: string;
}

export interface IFederation {
  [key: string]: IFederationEntry;
}
