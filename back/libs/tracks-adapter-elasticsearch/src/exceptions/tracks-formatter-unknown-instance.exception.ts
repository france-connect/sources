/* istanbul ignore file */

// Declarative code
import { TracksAdapterElasticsearchErrorCode } from '../enums';
import { TracksAdapterElasticsearchBaseException } from './tracks-adapter-elasticsearch-base.exception';

export class TracksFormatterUnknownInstanceException extends TracksAdapterElasticsearchBaseException {
  static CODE = TracksAdapterElasticsearchErrorCode.UNKNOWN_INSTANCE;
  static DOCUMENTATION =
    "Le champ service de la trace n'a pas permis de déterminer le type d'instance pour lequel formatter la trace";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI =
    'TracksAdapterElasticsearch.exceptions.tracksFormatterUnknownInstance';
}
