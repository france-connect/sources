import { Injectable } from '@nestjs/common';

import { CustomValidationOptionsBase } from '../interfaces';
import { ValidatorCustomService } from './validator-custom.service';

@Injectable()
export class ValidateIfRulesService {
  constructor(private readonly validatorCustom: ValidatorCustomService) {}

  ifNotEmpty(value: unknown): boolean {
    return this.validatorCustom.isNotEmpty(value as string);
  }

  ifDefined(value: unknown): boolean {
    return value !== undefined;
  }

  ifFieldNotEmpty(
    _value: unknown,
    targetField: string,
    { target }: CustomValidationOptionsBase,
  ): boolean {
    return this.validatorCustom.isNotEmpty(target[targetField] as string);
  }

  ifFieldDefined(
    targetField: string,
    { target }: CustomValidationOptionsBase,
  ): boolean {
    return target[targetField] !== undefined;
  }
}
