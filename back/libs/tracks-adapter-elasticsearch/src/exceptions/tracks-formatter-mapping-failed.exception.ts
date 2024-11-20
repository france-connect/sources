/* istanbul ignore file */

// Declarative code
import { TracksAdapterElasticsearchErrorCode } from '../enums';
import { TracksAdapterElasticsearchBaseException } from './tracks-adapter-elasticsearch-base.exception';

export class TracksFormatterMappingFailedException extends TracksAdapterElasticsearchBaseException {
  static CODE = TracksAdapterElasticsearchErrorCode.MAPPING_FAILED;
  static DOCUMENTATION =
    'TracksAdapterElasticsearch.exceptions.tracksFormatterMappingFailed, something went wrong during mapping process';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI =
    'TracksAdapterElasticsearch.exceptions.tracksFormatterMappingFailed';
}
