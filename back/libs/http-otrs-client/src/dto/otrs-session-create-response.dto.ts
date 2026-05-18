import { IsString } from 'class-validator';

import { OtrsSessionCreateResponseInterface } from '../interfaces';
import { OtrsErrorResponseDto } from './otrs-error-response.dto';

export class OtrsSessionCreateResponseDto
  extends OtrsErrorResponseDto
  implements OtrsSessionCreateResponseInterface
{
  @IsString()
  SessionID: string;
}
