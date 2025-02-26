import { Injectable } from '@nestjs/common';

import {
  Fields,
  MetadataDtoInterface,
  MetadataDtoValidatorsInterface,
  ValidatorType,
} from '@fc/dto2form';
import { I18nService, I18nVariables } from '@fc/i18n';

import { IsLengthI18nOptions } from '../interfaces';

@Injectable()
export class PartnersI18nService {
  constructor(private readonly i18nService: I18nService) {}

  public translation(payload: MetadataDtoInterface[]): MetadataDtoInterface[] {
    return payload.map((item) => {
      const label = this.getTranslation('label', item.name);
      const commonFields = { ...item, label };

      if (item.type === Fields.SECTION) {
        return commonFields;
      }

      const hint = this.getTranslation('hint', item.name);
      const validators = this.getValidatorsWithErrorLabels(
        item.validators,
        item.name,
      );

      return {
        ...commonFields,
        hint,
        validators,
      };
    });
  }

  private getTranslation(
    type: string,
    name: string,
    option?: I18nVariables,
  ): string {
    return this.i18nService.translate(`Form.${type}.${name}`, option);
  }

  private getValidatorsWithErrorLabels(
    validators: ValidatorType,
    name: string,
  ): ValidatorType {
    return this.processValidatorsRecursively(validators, name);
  }

  private processValidatorsRecursively(
    validators: ValidatorType,
    name: string,
  ): ValidatorType {
    return validators.map((validator) => {
      if (Array.isArray(validator)) {
        return this.processValidatorsRecursively(validator, name);
      }

      return this.enhanceValidatorWithErrorLabel(validator, name);
    }) as MetadataDtoValidatorsInterface[];
  }

  private enhanceValidatorWithErrorLabel(
    validator: MetadataDtoValidatorsInterface,
    name: string,
  ): MetadataDtoValidatorsInterface {
    let errorLabel: string;

    if (validator.name === 'isLength') {
      const { suffix, options } = this.generateI18nIsLengthParams(
        /* @Todo Revoir / challenger l'interface MetadataDtoValidatorsInterface
         * @see #2042
         */
        validator.validationArgs[0] as unknown as Record<string, unknown>,
      );

      errorLabel = this.getTranslation(
        `${validator.errorLabel}${suffix}`,
        name,
        { ...options },
      );
    } else {
      errorLabel = this.getTranslation(validator.errorLabel, name);
    }

    return { ...validator, errorLabel };
  }

  private generateI18nIsLengthParams(
    validationArgs: Record<string, unknown>,
  ): IsLengthI18nOptions {
    const keys = [];
    const options = {};

    Object.entries(validationArgs)
      .filter(([key]) => ['max', 'min'].includes(key))
      .forEach(([key, value]) => {
        keys.push(`.${key}`);
        options[key] = value;
      });

    const keysJoin = keys.join('');

    return { suffix: keysJoin, options };
  }
}
