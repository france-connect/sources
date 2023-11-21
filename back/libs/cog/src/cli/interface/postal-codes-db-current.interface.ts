/* istanbul ignore file */

// Declaration only
export interface PostalCodesDbCurrentInterface {
  '#Code_commune_INSEE': string;
  // CSV format
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Nom_de_la_commune: string;
  // CSV format
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Code_postal: string;
  // Not an error, the file always display this despite trying different encoding
  'Libell�_d_acheminement': string;
  // CSV format
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Ligne_5: string;
}
