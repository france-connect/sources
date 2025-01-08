import { ValidatorJs } from '../../enums';
import { IsSemVerValidator } from '../../interfaces';

export function $IsSemVer(): IsSemVerValidator {
  return { name: ValidatorJs.IS_SEM_VER };
}
