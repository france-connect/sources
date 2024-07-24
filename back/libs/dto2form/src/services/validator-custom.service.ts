import validatorjs from 'validator';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { CustomValidationOptionsBase } from '../interfaces';

@Injectable()
export class ValidatorCustomService {
  constructor(private readonly config: ConfigService) {}

  isString(value: unknown): boolean {
    return typeof value === 'string';
  }

  isNotEmpty(value: string): boolean {
    return !validatorjs.isEmpty(value);
  }

  isNotEqualToField(
    value: string,
    targetField: string,
    { target }: CustomValidationOptionsBase,
  ): boolean {
    return value !== target[targetField];
  }

  isEqualToConfig(
    value: string,
    configName: string,
    configField: string,
  ): boolean {
    const { [configField]: fieldValue } =
      this.config.get<Record<string, unknown>>(configName);

    return value === fieldValue;
  }
}
