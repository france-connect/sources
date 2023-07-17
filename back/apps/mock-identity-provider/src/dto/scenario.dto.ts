/* istanbul ignore file */

// Declarative code
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { Scenario } from '../enums';

export function itMatchesType(type: Scenario) {
  return (scenario) => scenario.type === type;
}

export class ScenarioDto {
  @IsString()
  name: string;

  @IsString()
  login: string;

  @IsEnum(Scenario)
  type: string;

  @ValidateIf(itMatchesType(Scenario.SERVER_RESPONSE))
  @IsNumber()
  status?: number;

  @ValidateIf(itMatchesType(Scenario.SERVER_RESPONSE))
  @IsString()
  body?: string;

  @ValidateIf(itMatchesType(Scenario.SERVER_RESPONSE))
  @IsOptional()
  @IsNumber()
  delay?: number;

  @ValidateIf(itMatchesType(Scenario.DELETE_CLAIMS))
  @IsString({ each: true })
  claims?: string[];
}
