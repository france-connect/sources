import { ValidatorJs } from '../../enums';
import { IsMongoIdValidator } from '../../interfaces';

export function $IsMongoId(): IsMongoIdValidator {
  return { name: ValidatorJs.IS_MONGO_ID };
}
