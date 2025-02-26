import { omitBy } from 'lodash';
import validatorjs from 'validator';

import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { ArrayAsyncHelper } from '@fc/common';
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
    target: Record<string, unknown | unknown[]>,
    { type, metatype, data }: ArgumentMetadata,
  ): Promise<Record<string, unknown | unknown[]>> {
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

    const validatedFields = await this.validate(target, metadata);

    const missingFields = this.validateRequiredField(target, metadata);

    const fieldValidationResults = [...validatedFields, ...missingFields];

    const hasErrors = this.hasValidatorsErrors(fieldValidationResults);

    if (hasErrors) {
      throw new Dto2FormValidationErrorException(fieldValidationResults);
    }

    const cleanedTarget = this.removeReadonlyFields(target, metadata);

    return cleanedTarget;
  }

  private removeReadonlyFields(
    target: Record<string, unknown>,
    metadata: FieldAttributes[],
  ): Record<string, unknown> {
    const readonlyFields = metadata
      .filter((field) => field.readonly)
      .map((field) => field.name);

    return omitBy(target, (_value, key) => readonlyFields.includes(key));
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
      validators: [],
    };

    if (!fieldMetadata) {
      fieldErrors.validators.push({
        name,
        errorLabel: `${name}_invalidKey_error`,
        validationArgs: [],
      });
      return fieldErrors;
    }

    if (fieldMetadata.readonly) {
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

    fieldErrors.validators = await this.handleFieldValidation(
      fieldErrors,
      target,
      fieldMetadata,
      name,
    );

    return fieldErrors;
  }

  private async handleFieldValidation(
    fieldErrors: FieldErrorsInterface,
    target: Record<string, unknown>,
    fieldMetadata: FieldAttributes,
    name: string,
  ): Promise<(FieldValidator | FieldValidator[])[]> {
    if (fieldMetadata.array) {
      fieldErrors.validators = await this.handleArrayValidation(
        target,
        fieldMetadata,
        name,
      );
    } else {
      fieldErrors.validators = await this.handleValidation(
        target,
        fieldMetadata,
        target[name],
      );
    }

    return fieldErrors.validators;
  }

  private async handleArrayValidation(
    target: Record<string, unknown | unknown[]>,
    fieldMetadata: FieldAttributes,
    name: string,
  ): Promise<(FieldValidator | FieldValidator[])[]> {
    const errorsMapAsync = await ArrayAsyncHelper.mapAsync<
      unknown,
      FieldValidator[]
    >(target[name] as unknown[], async (value) => {
      return await this.handleValidation(target, fieldMetadata, value);
    });

    // Check that there are empty arrays,
    // which would indicate that there are no errors
    const isArrayEmpty = errorsMapAsync.every(
      (item) => Array.isArray(item) && item.length === 0,
    );

    if (isArrayEmpty) {
      const errorsMapAsyncFlat = errorsMapAsync.flat();
      return errorsMapAsyncFlat;
    }

    return errorsMapAsync;
  }

  private async handleValidation(
    target: Record<string, unknown | unknown[]>,
    fieldMetadata: FieldAttributes,
    value: unknown,
  ): Promise<FieldValidator[]> {
    return await ArrayAsyncHelper.reduceAsync<FieldValidator, FieldValidator[]>(
      fieldMetadata.validators,
      async (errors, validator) => {
        return await this.processValidator(errors, validator, value, target);
      },
      [],
    );
  }

  private async processValidator(
    errors: FieldValidator[],
    validator: FieldValidator,
    value: unknown,
    target: Record<string, unknown | unknown[]>,
  ): Promise<FieldValidator[]> {
    const valid = await this.callValidator(validator, value, target);

    if (!valid) {
      errors.push({
        name: validator.name,
        errorLabel: validator.errorLabel,
        validationArgs: validator.validationArgs,
      });
    }

    return errors;
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

  private hasValidatorsErrors(target: FieldErrorsInterface[]): boolean {
    return target.some(({ validators }) => validators.length > 0);
  }

  private validateRequiredField(
    target: Record<string, unknown>,
    metadata: FieldAttributes[],
  ): FieldErrorsInterface[] {
    const missingRequireKeys = metadata
      .filter((item) => item.required)
      .map((item) => item.name)
      .filter((key) => !(key in target))
      .map((key) => ({
        name: key,
        validators: [
          {
            name: 'isFilled',
            errorLabel: `isFilled_error`,
            validationArgs: [],
          },
        ],
      }));

    return missingRequireKeys;
  }
}
