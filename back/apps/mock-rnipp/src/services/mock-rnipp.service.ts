import { Injectable } from '@nestjs/common';

import { ExceptionKey, RnippCode, Scenario } from '../enums';
import { MockRnippInvalidDateFormatException } from '../exceptions';

@Injectable()
export class MockRnippService {
  private exceptionKeysList = Object.values(ExceptionKey);

  getExceptionKey(prenoms: string): ExceptionKey | undefined {
    const key = prenoms.split('_').pop() as ExceptionKey;

    if (this.exceptionKeysList.includes(key)) {
      return key;
    }

    return undefined;
  }

  // eslint-disable-next-line complexity
  getRnippCode(
    codeLieuNaissance: string,
    exceptionKey?: ExceptionKey,
  ): RnippCode | undefined {
    switch (exceptionKey) {
      case undefined:
        return RnippCode.TWO;

      case ExceptionKey.E010007:
        return RnippCode.SEVEN;

      case ExceptionKey.MULTICOG:
      case ExceptionKey.MULTICOGECHO:
      case ExceptionKey.MULTICOGERROR:
        return this.handleMultipleCog(exceptionKey, codeLieuNaissance);

      default:
        return undefined;
    }
  }

  private handleMultipleCog(
    exceptionKey: ExceptionKey,
    codeLieuNaissance: string,
  ): RnippCode {
    if (codeLieuNaissance === '27161') {
      return {
        [ExceptionKey.MULTICOG]: RnippCode.TWO,
        [ExceptionKey.MULTICOGECHO]: RnippCode.FOUR,
        [ExceptionKey.MULTICOGERROR]: RnippCode.EIGHT,
      }[exceptionKey];
    } else {
      return RnippCode.EIGHT;
    }
  }

  // eslint-disable-next-line complexity
  getScenario(exceptionKey: ExceptionKey): Scenario {
    switch (exceptionKey) {
      case ExceptionKey.E010011:
        return Scenario.TIMEOUT;

      case undefined:
      case ExceptionKey.E010007:
      case ExceptionKey.MULTICOG:
      case ExceptionKey.MULTICOGECHO:
      case ExceptionKey.MULTICOGERROR:
        return Scenario.SUCCESS;

      default:
        return Scenario.ERROR;
    }
  }

  /**
   * Formats a date from 'YYYYMMDD' to 'YYYY-MM-DD', 'YYYY-MM', or 'YYYY',
   * removing any parts of the date that are '00'.
   * @param date A date string in the format 'YYYYMMDD'
   * @returns A formatted date string
   */
  formatDate(date: string): string {
    const dateSanityCheck = /^\d{8}$/.test(date);

    if (!dateSanityCheck) {
      throw new MockRnippInvalidDateFormatException();
    }

    const [, year, month, day] = date.match(/(\d{4})(\d{2})(\d{2})/);

    if (month === '00' && day !== '00') {
      throw new MockRnippInvalidDateFormatException();
    }

    return this.formatDateParts(year, month, day);
  }

  /**
   * Formats date parts based on presumed values (00 for unknown parts).
   * @param year The year part
   * @param month The month part
   * @param day The day part
   * @returns A formatted date string
   */
  private formatDateParts(year: string, month: string, day: string): string {
    if (month === '00') {
      return year;
    } else if (day === '00') {
      return `${year}-${month}`;
    }

    return `${year}-${month}-${day}`;
  }

  /**
   * Formats names from 'name1 name2 name3' to a list of string ['name1', 'name2', 'name3'],
   * @param prenoms A string composed of one or several names
   * @returns A list of string
   */
  formatName(prenoms: string): string[] {
    return (prenoms as string).split(' ');
  }
}
