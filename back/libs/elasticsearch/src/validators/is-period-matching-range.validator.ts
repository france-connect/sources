import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { PERIOD_REGEX_BY_RANGE } from '../constants';
import { ElasticControlRangeEnum } from '../enums';

@ValidatorConstraint({ name: 'isPeriodMatchingRange' })
@Injectable()
export class IsPeriodMatchingRangeConstraint implements ValidatorConstraintInterface {
  validate(period: unknown, args: ValidationArguments): boolean {
    if (typeof period !== 'string') {
      return false;
    }

    const { range } = args.object as { range: ElasticControlRangeEnum };
    const regex = PERIOD_REGEX_BY_RANGE[range];

    return Boolean(regex && regex.test(period));
  }

  defaultMessage(args: ValidationArguments): string {
    const { range } = args.object as { range: ElasticControlRangeEnum };
    const expected = {
      [ElasticControlRangeEnum.MONTH]: 'YYYY-MM',
      [ElasticControlRangeEnum.YEAR]: 'YYYY',
      [ElasticControlRangeEnum.SEMESTER]: 'YYYY-01 or YYYY-07',
    }[range];

    return `period must be in the format ${expected} for ${range} range`;
  }
}

export function IsPeriodMatchingRange(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPeriodMatchingRangeConstraint,
    });
  };
}
