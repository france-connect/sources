import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { OtrsErrorResponseInterface } from '../interfaces';

class OtrsErrorDetailDto {
  @IsString()
  ErrorMessage: string;

  @IsString()
  ErrorCode: string;
}

export class OtrsErrorResponseDto implements OtrsErrorResponseInterface {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OtrsErrorDetailDto)
  Error?: OtrsErrorDetailDto;
}
