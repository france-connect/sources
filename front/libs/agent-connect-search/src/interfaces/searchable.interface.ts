/* istanbul ignore file */

// declarative file
export interface Searchable {
  ministryId: string;
  /** idpId can be present with the value `undefined`.
   * It occurs for ministry that have no idp yet, they have to be searchable
   * in order to display results to users.
   */
  idpId: string | undefined;
  data: string;
  sort: number;
}
