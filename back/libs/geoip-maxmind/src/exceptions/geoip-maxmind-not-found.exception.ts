import { ErrorCode } from '../enums';
import { GeoipMaxmindBaseException } from './geoip-maxmind-base.exception';

export class GeoipMaxmindNotFoundException extends GeoipMaxmindBaseException {
  static CODE = ErrorCode.DATABASE_NOT_FOUND;
  static DOCUMENTATION = `La base de donnée local GeoIP Maxmind n'a pa pu être chargée`;
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'GeoipMaxmind.exceptions.geoipMaxmindNotFound';
}
