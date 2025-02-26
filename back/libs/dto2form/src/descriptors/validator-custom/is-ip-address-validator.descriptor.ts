import { ValidatorCustom } from '../../enums';
import { IsIpAddressesAndRangeValidator } from '../../interfaces';

export function $IsIpAddressesAndRange(): IsIpAddressesAndRangeValidator {
  return { name: ValidatorCustom.IS_IP_ADDRESSES_AND_RANGE };
}
