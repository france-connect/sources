/* istanbul ignore file */

// Declarative code

import { Description, Loggable } from '@fc/exceptions';

import { CsvBaseException } from './csv-base.exception';

@Loggable()
@Description("Problème d'extraction des données CSV")
export class CsvParsingException extends CsvBaseException {
  code = 0;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
