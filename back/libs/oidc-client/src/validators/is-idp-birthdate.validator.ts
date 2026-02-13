import { registerDecorator, ValidationOptions } from 'class-validator';
import { DateTime } from 'luxon';

/**
 * Check if value matches YYYY-00-00 format and has valid year
 */
function isPresumedMonthAndDay(value: string): boolean {
  const match = /^(\d{4})-00-00$/.exec(value);
  if (!match) {
    return false;
  }
  const year = match[1];
  return DateTime.fromFormat(year, 'yyyy').isValid;
}

/**
 * Check if value matches YYYY-MM-00 format and has valid year/month
 */
function isPresumedDay(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-00$/.exec(value);
  if (!match) {
    return false;
  }
  const [, year, month] = match;
  return DateTime.fromFormat(`${year}-${month}`, 'yyyy-MM').isValid;
}

/**
 * Check if value is a full valid date (YYYY-MM-DD)
 */
function isFullDate(value: string): boolean {
  return DateTime.fromFormat(value, 'yyyy-MM-dd').isValid;
}

export function validateIdpBirthdate(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  if (isPresumedMonthAndDay(value)) {
    return true;
  }

  if (isPresumedDay(value)) {
    return true;
  }

  return isFullDate(value);
}

/**
 * Check if the field is a valid Identity Provider birthdate
 * Accepts: YYYY-MM-DD, YYYY-MM-00, YYYY-00-00
 * @param validationOptions
 */
export function IsIdpBirthdate(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isIdpBirthdate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: validateIdpBirthdate,
      },
    });
  };
}
