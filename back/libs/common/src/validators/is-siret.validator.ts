import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isString } from 'lodash';

import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isSiret' })
@Injectable()
export class IsSiretConstraint implements ValidatorConstraintInterface {
  validate(siret: unknown): boolean {
    if (!isString(siret)) {
      return false;
    }

    const siretNoSpaces = (siret as string).replace(/\s/g, '');

    if (!/^\d{14}$/.test(siretNoSpaces)) {
      return false;
    }

    const luhnOk = this.luhnChecksum(siretNoSpaces) % 10 === 0;

    if (luhnOk) {
      return true;
    }

    return this.isValidLaPosteSiretAlternative(siretNoSpaces);
  }

  defaultMessage(): string {
    return `Le siret est invalide.`;
  }

  /**
   * Siren and siret follow the luhn checksum algorithm except La Poste
   * https://fr.wikipedia.org/wiki/Formule_de_Luhn
   * ex : 889742876 00009 dos not follow Luhn's rule
   *
   * Thanks to Xavier Jouppe and  Annuaire des Entreprises
   * cf: https://github.com/annuaire-entreprises-data-gouv-fr/site/blob/67fab25416fbfc6d482c0993f6560ba5cec203f1/utils/helpers/siren-and-siret.ts#L84
   */
  private luhnChecksum(str: string): number {
    return Array.from(str)
      .reverse()
      .map((character, charIdx) => {
        const num = parseInt(character, 10);
        const isIndexEven = (charIdx + 1) % 2 === 0;
        return isIndexEven ? num * 2 : num;
      })
      .reduce((checksum: number, num: number) => {
        const val = num >= 10 ? num - 9 : num;
        return checksum + val;
      }, 0);
  }

  private isValidLaPosteSiretAlternative(siret: string): boolean {
    if (!siret.startsWith('356000000')) {
      return false;
    }

    const sum = Array.from(siret).reduce((acc, ch) => {
      const digit = parseInt(ch, 10);
      return acc + digit;
    }, 0);

    return sum % 5 === 0;
  }
}

export function IsSiret(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSiretConstraint,
    });
  };
}
