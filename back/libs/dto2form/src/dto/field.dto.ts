import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Optional } from '@nestjs/common';

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

  @IsString()
  @IsNotEmpty()
  readonly errorLabel: string;

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

  @IsString()
  @IsNotEmpty()
  readonly label: string;

  @IsBoolean()
  readonly required: boolean;

  @IsOptional()
  @IsNumber()
  readonly order?: number;

  @ValidateNested({ each: true })
  @Type(() => ValidatorDto)
  readonly validators: ValidatorDto[];

  @Optional()
  @ValidateNested({ each: true })
  @Type(() => ValidateIfDto)
  readonly validateIf?: ValidateIfDto[];
}
