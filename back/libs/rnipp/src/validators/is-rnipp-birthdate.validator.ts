import { registerDecorator, ValidationOptions } from 'class-validator';
import * as moment from 'moment';

export function validateRnippBirthdate(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  /*
   * Expected:
   * YYYY-00-00 => YYYY
   * YYYY-MM-00 => YYYY-MM
   * YYYY-MM-DD => YYYY-MM-DD
   */

  const isFullDate = moment(value, 'YYYY-MM-DD', true).isValid();
  const isPresumeDay = moment(value, 'YYYY-MM', true).isValid();
  const isPresumeMonth = moment(value, 'YYYY', true).isValid();

  /**
   * Explanation on "présumés nés": @see https://www.legislation.cnav.fr/Pages/texte.aspx?Nom=CR_CN_2006013_07022006#1
   */
  const isPresume = isPresumeDay || isPresumeMonth;

  return isFullDate || isPresume;
}

/**
 * Check if the field is a valid birthdate (YYYY-00-00, YYYY-MM-00, YYYY-MM-DD)
 * @param validationOptions
 */
export function IsRnippBirthdate(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isRnippBirthdate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: validateRnippBirthdate,
      },
    });
  };
}
