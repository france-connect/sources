import {
  arrayContains,
  isObject,
  ValidateBy,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

import { FeatureHandler } from '../decorators';
import { IFeatureHandlerDatabase } from '../interfaces';
import { isNotValidFeatureHandlerKey } from '../utils';

export class IsRegisteredFeatureHandlerConstraint
  implements ValidatorConstraintInterface
{
  validate(value: IFeatureHandlerDatabase): boolean {
    if (!isObject(value)) {
      return false;
    }

    const handlerNames = Object.values(value);
    if (handlerNames.some(isNotValidFeatureHandlerKey)) {
      return false;
    }

    const filterHandler = handlerNames.filter(Boolean);
    const registredHandlers = FeatureHandler.getAll();

    return arrayContains(registredHandlers, filterHandler);
  }

  defaultMessage(): string {
    const registredHandlers = FeatureHandler.getAll();
    return `property should be in [${registredHandlers.toString()}]`;
  }
}

/* istanbul ignore next */
export function IsRegisteredHandler(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsRegisteredFeatureHandler',
      validator: IsRegisteredFeatureHandlerConstraint.prototype,
    },
    validationOptions,
  );
}
