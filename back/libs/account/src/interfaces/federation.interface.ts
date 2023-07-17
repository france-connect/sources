/* Temporarily we have to handle old and new spFederation format, as long as data migration
is not finished to reconcile legacy an fcp-low mongo databases to have just one database */
type OldSpFederation = {
  sub: string;
};

export interface IFederation {
  [key: string]: string | OldSpFederation;
}
