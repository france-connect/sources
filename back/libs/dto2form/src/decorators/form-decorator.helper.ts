import { getMetadataStorage } from 'class-validator';

import {
  FieldAttributes,
  FieldAttributesArguments,
  FieldValidator,
  FieldValidatorBase,
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
    fieldName: string,
    validators: FieldValidatorBase[],
  ): [FieldValidator, ...FieldValidator[]] {
    return validators.map((validator: FieldValidatorBase) => {
      const finalValidator = validator as FieldValidator;

      finalValidator.errorLabel = `${fieldName}_${validator.name}_error`;
      finalValidator.validationArgs = validator.validationArgs || [];

      return validator;
    }) as [FieldValidator, ...FieldValidator[]];
  }

  static generateFieldMissingAttributes<T extends FieldAttributes>(
    key: string,
    attributes: FieldAttributesArguments,
    defaultOrder: number,
    defaultType: string,
  ): T {
    return Object.assign({}, attributes, {
      type: attributes.type || defaultType,
      name: key,
      label: `${key}_label`,
      required: Boolean(attributes.required),
      order: attributes.order || defaultOrder,
      validateIf: attributes.validateIf || [],
      validators: FormDecoratorHelper.generateFieldValidatorsMissingAttributes(
        key,
        attributes.validators,
      ),
    }) as T;
  }
}
