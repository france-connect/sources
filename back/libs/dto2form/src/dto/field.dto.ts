import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Optional } from '@nestjs/common';

import { FieldMessage } from './field-message.dto';

export class ValidateIfDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsArray()
  readonly ruleArgs?: unknown[];
}

export class ValidatorDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => FieldMessage)
  readonly errorMessage: FieldMessage;

  @IsOptional()
  @IsArray()
  readonly validationArgs?: unknown[];
}

export class FieldDto {
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsBoolean()
  readonly required?: boolean;

  @IsOptional()
  @IsNumber()
  readonly order?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ValidatorDto)
  readonly validators?: ValidatorDto[];

  @Optional()
  @ValidateNested({ each: true })
  @Type(() => ValidateIfDto)
  readonly validateIf?: ValidateIfDto[];
}
