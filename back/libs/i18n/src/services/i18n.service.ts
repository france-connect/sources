import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { SessionService } from '@fc/session';
import { TemplateMethod } from '@fc/view-templates';

import { I18nConfig, I18nSession } from '../dto';
import {
  I18nInvalidOrMissingCountVariableException,
  I18nKeyNotFoundException,
} from '../exceptions';
import { I18nMissingVariableException } from '../exceptions/i18n-missing-variable.exception';
import {
  I18nComplexTermInterface,
  I18nTermKey,
  I18nTermType,
  I18nTranslateOptionsInterface,
  I18nTranslationsMapType,
  I18nVariables,
} from '../interfaces';

@Injectable()
export class I18nService {
  constructor(
    private readonly config: ConfigService,
    private readonly session: SessionService,
  ) {}

  @TemplateMethod('translate')
  translate(
    key: I18nTermKey,
    variables?: I18nVariables,
    options: I18nTranslateOptionsInterface = {},
  ): string {
    const translations = this.getTranslations(options);
    const output: I18nTermType = translations[key];

    if (output === undefined) {
      throw new I18nKeyNotFoundException(key);
    }

    return this.replaceVariables(output, variables, options);
  }

  setSessionLanguage(language: string): void {
    return this.session.set('I18n', { language });
  }

  private getTranslations(
    options: I18nTranslateOptionsInterface,
  ): I18nTranslationsMapType {
    let language = options.language;

    if (!language) {
      const session = this.session.get<I18nSession>('I18n');
      language = session?.language;
    }

    if (!language) {
      language = this.config.get<I18nConfig>('I18n').defaultLanguage;
    }

    const { translations } = this.config.get<I18nConfig>('I18n');

    return translations[language];
  }

  private replaceVariables(
    input: I18nTermType,
    variables: I18nVariables,
    options: I18nTranslateOptionsInterface,
  ): string {
    let output: string;

    if (typeof input !== 'string') {
      output = this.getPluralDefinition(input, variables);
    } else {
      output = input;
    }

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        output = output.replace(`{${key}}`, this.getVariable(value, options));
      });
    }

    return output;
  }

  private getVariable(
    value: string | number,
    options: I18nTranslateOptionsInterface,
  ) {
    if (options.escapeVariables) {
      return value
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&34;')
        .replace(/'/g, '&#39');
    }

    return value.toString();
  }

  // This methods centralize multiples yet simples rules
  // It's more readable to keep all in one place
  // eslint-disable-next-line complexity
  private getPluralDefinition(
    input: I18nComplexTermInterface,
    variables: I18nVariables,
  ): string {
    if (!variables) {
      throw new I18nMissingVariableException();
    }

    const count = variables[input.term];

    if (typeof count !== 'number') {
      throw new I18nInvalidOrMissingCountVariableException(input.term);
    }

    const def = input.definition;

    if (count === 0) {
      return def.zero || def.other;
    }

    if (count === 1) {
      return def.one || def.few || def.other;
    }

    if (count === 2) {
      return def.two || def.few || def.other;
    }

    if (count >= 3 && count <= 6) {
      return def.few || def.other;
    }

    return def.many || def.other;
  }
}
