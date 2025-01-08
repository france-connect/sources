import { ValidatorJs } from '../../enums';
import { IsFreightContainerIDValidator } from '../../interfaces';

export function $IsFreightContainerID(): IsFreightContainerIDValidator {
  return {
    name: ValidatorJs.IS_FREIGHT_CONTAINER_ID,
  };
}
