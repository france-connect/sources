/* istanbul ignore file */

// Declarative code
/**
 * This format is the one used by the FC apps + extra data set by Elastisearch.
 *
 * @example {
 *   _index: "fc_tracks",
 *   _type: "_doc",
 *   _id: "kpAkdnoBub7RTlGdmpzI",
 *   _score: 1.0,
 *   _source: {
 *     event: "FC_REQUESTED_IDP_USERINFO",
 *     date: "2021-11-05T12:09:08.207+01:00",
 *     spId: "001",
 *     spName: "EDF",
 *     spAcr: "eidas1",
 *     country: "FR",
 *     city: "Paris"
 *   }
 * }
 */
export interface ICsmrTracksInputTrack {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: {
    event: string;
    date: string;
    accountId: string;
    spId: string;
    spName: string;
    spAcr: string;
    country: string;
    city: string;
  };
}
