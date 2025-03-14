import { getMetadataStorage } from 'class-validator';

import { convertRegExpToStrings } from '../helpers';
import {
  ChoiceAttributes,
  FieldAttributes,
  FieldAttributesArguments,
  FieldValidateIfRule,
  FieldValidator,
  FieldValidatorBase,
  TextAttributes,
} from '../interfaces';

export class FormDecoratorHelper {
  static checkCompatibility(constructor) {
    const metadata =
      getMetadataStorage()['validationMetadatas'].get(constructor);

    if (metadata) {
      throw new Error(
        `Please remove class validator decorators from "${constructor}" to use as form. See dto2form library documentation for more information.`,
      );
    }
  }

  static generateFieldValidatorsMissingAttributes(
    validators: FieldValidatorBase[],
  ): [FieldValidator, ...FieldValidator[]] {
    return validators.map((validator: FieldValidatorBase) => {
      const finalValidator = validator as FieldValidator;

      finalValidator.errorMessage = `${validator.name}_error`;
      finalValidator.validationArgs = convertRegExpToStrings(
        validator.validationArgs,
      );

      return validator;
    }) as [FieldValidator, ...FieldValidator[]];
  }

  static generateTextMissingAttributes(
    key: string,
    attributes: Pick<FieldAttributesArguments, 'order'>,
    defaultOrder: number,
    defaultType: string,
  ): TextAttributes {
    return {
      name: key,
      type: defaultType,
      order: attributes.order || defaultOrder,
    };
  }

  static getDefaultAttributes<T>(
    key: string,
    attributes: FieldAttributesArguments,
    defaultAttribute?: number | string | FieldValidateIfRule[],
  ): T {
    return attributes[key] || defaultAttribute;
  }

  static generateFieldMissingAttributes<T extends FieldAttributes>(
    key: string,
    attributes: FieldAttributesArguments,
    defaultOrder: number,
    defaultType: string,
  ): T {
    const validators =
      FormDecoratorHelper.generateFieldValidatorsMissingAttributes(
        attributes.validators,
      );

    const array = Boolean(attributes.array);
    const required = Boolean(attributes.required);
    const readonly = Boolean(attributes.readonly);

    const type = FormDecoratorHelper.getDefaultAttributes<string>(
      'type',
      attributes,
      defaultType,
    );
    const order = FormDecoratorHelper.getDefaultAttributes<number>(
      'order',
      attributes,
      defaultOrder,
    );
    const validateIf = FormDecoratorHelper.getDefaultAttributes<
      FieldValidateIfRule[]
    >('validateIf', attributes, [] as FieldValidateIfRule[]);

    const initialValue = FormDecoratorHelper.getInitialValue(
      array,
      attributes.initialValue,
    );

    const result = Object.assign({}, attributes, {
      type,
      name: key,
      required,
      readonly,
      initialValue,
      array,
      order,
      validateIf,
      validators,
    }) as T;

    return result;
  }

  static generateInputChoiceMissingAttributes(
    attributes: ChoiceAttributes,
  ): ChoiceAttributes {
    attributes.inline = Boolean(attributes.inline);

    return attributes;
  }

  static handleRequiredField<T extends FieldAttributes>(attributes: T): T {
    if (attributes.required) {
      const requiredFieldValidator = {
        name: 'isFilled',
        errorMessage: `isFilled_error`,
        validationArgs: [],
      };
      attributes.validators.unshift(requiredFieldValidator);
    }

    return attributes;
  }

  private static getInitialValue(
    isArray: boolean,
    initialValue?: string | string[],
  ): string | string[] {
    const defaultInitialValue = isArray ? [''] : '';

    const isUndefined = initialValue === undefined;
    return !isUndefined ? initialValue : defaultInitialValue;
  }
}
