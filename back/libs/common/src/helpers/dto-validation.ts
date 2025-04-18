import 'reflect-metadata';

import {
  ClassTransformOptions,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import {
  validate,
  validateSync,
  ValidationError,
  ValidatorOptions,
} from 'class-validator';

import { Type } from '@nestjs/common';

import { CommonDtoValidationException } from '../exceptions';
import { InputWithErrorsInterface } from '../interfaces';

/**
 * @todo #428  Supprimer les Type<> et créer un InstanceOf<> identique mais
 * indépendant de NestJS
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/428
 */
export function getTransformed<T>(
  plain: unknown,
  dto: Type<any>,
  options?: ClassTransformOptions,
): T {
  return plainToInstance<T, unknown>(dto, plain, options);
}

export async function validateDto(
  plain: unknown,
  dto: Type<any>,
  validatorOptions: ValidatorOptions,
  transformOptions?: ClassTransformOptions,
): Promise<ValidationError[]> {
  const object = getTransformed<typeof dto>(plain, dto, transformOptions);

  /**
   *  @todo
   *    author: Arnaud
   *    date: 19/03/2020
   *    ticket: FC-244 (identity, DTO, Validate)
   *
   *    context: On n'utilise pas l'objet transformé !
   *    problem: on valide l'object transformé mais on ne récupère pas l'objet transformé et donc nettoyé des inconnues
   *    action: renvoyer un objet contenant résultat ou erreurs éventuelles.
   */
  return await validate(object, validatorOptions);
}
export async function getValidDto<T extends object>(
  plain: unknown,
  dto: Type<T>,
  validatorOptions: ValidatorOptions,
  transformOptions?: ClassTransformOptions,
): Promise<T> {
  const object = getTransformed<T>(plain, dto, transformOptions);

  const errors = await validate(object, validatorOptions);
  if (errors.length) {
    throw new CommonDtoValidationException(errors);
  }

  return object;
}

export function validateDtoSync(
  plain: object,
  dto: Type<any>,
  validatorOptions: ValidatorOptions,
  transformOptions?: ClassTransformOptions,
): ValidationError[] {
  const object = getTransformed<typeof dto>(plain, dto, transformOptions);

  /**
   *  @todo
   *    author: Arnaud
   *    date: 19/03/2020
   *    ticket: FC-244 (identity, DTO, Validate)
   *
   *    context: On n'utilise pas l'objet transformé !
   *    problem: on valide l'object transformé mais on ne récupère pas l'objet transformé et donc nettoyé des inconnues
   *    action: renvoyer un objet contenant résultat ou erreurs éventuelles.
   */
  return validateSync(object, validatorOptions);
}

/**
 * function to transform and validate raw data.
 * @param plain Data to transform and validate
 * @param dto the Dto to validate and transform data
 * @param validatorOptions options for the validator process
 * @param transformOptions options for the transform process
 * @returns
 */
export async function filteredByDto<T = any>(
  plain: object,
  dto: Type<T>,
  validatorOptions: ValidatorOptions,
  transformOptions?: ClassTransformOptions,
): Promise<{ errors: ValidationError[]; result: T }> {
  const data = getTransformed<typeof dto>(plain, dto, transformOptions);
  const errors = await validate(data, validatorOptions);
  if (errors.length) {
    return { errors, result: null };
  }
  const result = instanceToPlain(data) as T;
  return { errors, result };
}

/**
 * Extract the failed constraints from the current DTO validation error
 * @param error The current validation error to format
 * @param prefix The property path like <property1>.<...>.<propertyN>
 *
 * @returns The new messages array
 */
function formatErrorMessages(error: ValidationError, prefix: string) {
  const constraints = Object.keys(error.constraints);

  return constraints.map((constraint) => {
    return `${prefix}${error.property}: ${constraint}`;
  });
}

/**
 * Recursively extract all failed constraints from the DTO validation result
 * @param validationErrors The current DTO errors to format
 * @param prefix The property path like <property1>.<...>.<propertyN>
 *
 * @returns The messages in an array
 */
/**
 * @todo FC-2184 ⚠️
 */
// eslint-disable-next-line complexity
export function getAllPropertiesErrors(
  validationErrors: ValidationError[],
  prefix = '',
): string[] {
  let messages = [];

  for (const error of validationErrors) {
    if (error.constraints) {
      messages = messages.concat(formatErrorMessages(error, prefix));
    }
    /**
     * Required default value on children because validationError.toString required it
     */
    if (!error.children) {
      error.children = [];
    }

    messages = messages.concat(
      getAllPropertiesErrors(error.children, `${prefix}${error.property}.`),
    );
  }

  return messages;
}

/**
 * Format and return an error containing all failed constraints for each property
 * @param validationErrors DTO validation result
 *
 * @returns An error containing the failed constraints for each property
 */
export function getDtoErrors(
  validationErrors: ValidationError[],
): Error | null {
  const errors = getAllPropertiesErrors(validationErrors);

  if (errors.length === 0) {
    return null;
  }

  return new Error(errors.join('\n'));
}

export function getDtoInputWithErrors(
  validationErrors: ValidationError[],
): Record<string, InputWithErrorsInterface> | null {
  if (validationErrors.length === 0) {
    return null;
  }

  const properties = validationErrors[0].target;

  const input = {};

  Object.entries(properties).forEach(([key, value]) => {
    input[key] = { value, errors: [] };
  });

  validationErrors.forEach(({ constraints, property }) => {
    input[property].errors = Object.values(constraints);
  });

  return input;
}
