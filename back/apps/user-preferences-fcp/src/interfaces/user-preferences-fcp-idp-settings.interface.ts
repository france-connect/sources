/* istanbul ignore file */

// Declarative code
/**
 * This format is the one used by the FC apps.
 *
 * @example {
 *   updatedAt: ISODate("2020....."),
 *   includeList: ['idp_id_x', 'idp_id_y']
 * }
 */
export interface IIdpSettings {
  updatedAt: Date | null;
  includeList: string[];
}
