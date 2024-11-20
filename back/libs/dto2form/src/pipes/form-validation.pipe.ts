import validatorjs from 'validator';

import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { ArrayAsyncHelper } from '@fc/common/helpers/array-async.helper';
import { LoggerService } from '@fc/logger';

import { FormDtoBase } from '../dto';
import {
  Dto2FormInvalidFormException,
  Dto2FormValidateIfRuleNotFoundException,
  Dto2FormValidationErrorException,
} from '../exceptions';
import {
  FieldAttributes,
  FieldErrorsInterface,
  FieldValidateIfRule,
  FieldValidator,
} from '../interfaces';
import { ValidateIfRulesService, ValidatorCustomService } from '../services';
import { FORM_METADATA_TOKEN } from '../tokens';

@Injectable()
export class FormValidationPipe implements PipeTransform {
  constructor(
    private readonly logger: LoggerService,
    private readonly validatorCustom: ValidatorCustomService,
    private readonly validateIfRules: ValidateIfRulesService,
  ) {}

  // eslint-disable-next-line complexity
  async transform(
    target: Record<string, unknown>,
    { type, metatype, data }: ArgumentMetadata,
  ): Promise<Record<string, unknown>> {
    const validType = type === 'body' || type === 'query';
    const isSubObject = Boolean(data);
    if (!validType || isSubObject) {
      return target;
    }

    if (!(metatype.prototype instanceof FormDtoBase)) {
      throw new Dto2FormInvalidFormException();
    }

    const metadata: FieldAttributes[] = Reflect.getMetadata(
      FORM_METADATA_TOKEN,
      metatype,
    );

    const errors = await this.validate(target, metadata);

    if (errors.length > 0) {
      throw new Dto2FormValidationErrorException(errors);
    }

    return target;
  }

  private async validate(
    target: Record<string, unknown>,
    metadata: FieldAttributes[],
  ): Promise<FieldErrorsInterface[]> {
    return await ArrayAsyncHelper.mapAsync(
      this.getAttributeKeys(target),
      this.validateField.bind(this, target, metadata),
    );
  }

  private async validateField(
    target: Record<string, unknown>,
    metadata: FieldAttributes[],
    name: string,
  ): Promise<FieldErrorsInterface> {
    const fieldMetadata = metadata.find((field) => field.name === name);

    const fieldErrors: FieldErrorsInterface = {
      name,
      errors: [],
    };
    if (!fieldMetadata) {
      fieldErrors.errors.push(`${name}_invalidKey_error`);
      return fieldErrors;
    }

    const shouldValidate = await this.shouldValidate(
      target[name],
      target,
      fieldMetadata.validateIf,
    );

    if (!shouldValidate) {
      return fieldErrors;
    }

    fieldErrors.errors = await ArrayAsyncHelper.reduceAsync<
      FieldValidator,
      FieldErrorsInterface['errors']
    >(
      fieldMetadata.validators,
      async (errors, validator) => {
        const valid = await this.callValidator(validator, target[name], target);

        if (!valid) {
          errors.push(validator.errorLabel);
        }

        return errors;
      },
      [],
    );

    return fieldErrors;
  }

  private async shouldValidate(
    value: unknown,
    target: Record<string, unknown>,
    validateIf: FieldValidateIfRule[],
  ): Promise<boolean> {
    if (!Array.isArray(validateIf)) {
      return true;
    }

    return await ArrayAsyncHelper.everyAsync(
      validateIf,
      async (rule) => await this.callValidateIfRule(rule, value, target),
    );
  }

  private async callValidateIfRule(
    validateIfRule: FieldValidateIfRule,
    value: unknown,
    target: Record<string, unknown>,
  ): Promise<boolean | never> {
    const context = {
      target,
    };
    if (!this.validateIfRules[validateIfRule.name]) {
      this.logger.crit(
        `Conditional validation rule not found: ${validateIfRule.name}`,
      );
      throw new Dto2FormValidateIfRuleNotFoundException();
    }

    const ruleArgs = validateIfRule.ruleArgs || [];

    return await this.validateIfRules[validateIfRule.name].call(
      this.validateIfRules,
      value,
      ...ruleArgs,
      context,
    );
  }

  private async callValidator(
    validator: FieldValidator,
    value: unknown,
    target: Record<string, unknown>,
  ): Promise<boolean> {
    const validationFunction = validatorjs[validator.name]
      ? validatorjs
      : this.validatorCustom;

    const validationArgs = [...validator.validationArgs];

    if (validationFunction === this.validatorCustom) {
      const context = {
        target,
      };

      validationArgs.push(context);
    }

    return await validationFunction[validator.name]?.call(
      validationFunction,
      value,
      ...validationArgs,
    );
  }

  private getAttributeKeys(target: Record<string, unknown>): string[] {
    return Object.keys(target).filter(
      (key) => typeof target[key] !== 'function',
    );
  }
}
