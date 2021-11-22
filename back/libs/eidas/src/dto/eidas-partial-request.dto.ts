/* istanbul ignore file */

// Declarative code
import { IsArray, IsEnum, IsString } from 'class-validator';

import { EidasAttributes, EidasLevelOfAssurances } from '../enums';

export class EidasPartialRequest {
  @IsString()
  @IsEnum(EidasLevelOfAssurances)
  levelOfAssurance: EidasLevelOfAssurances;

  @IsArray()
  @IsEnum(EidasAttributes, { each: true })
  requestedAttributes: EidasAttributes[];
}
