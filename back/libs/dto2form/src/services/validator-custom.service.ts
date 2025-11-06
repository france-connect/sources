import validatorjs from 'validator';

import { Injectable } from '@nestjs/common';

import { hasSameHost } from '@fc/common';
import { ConfigService } from '@fc/config';

import { CustomValidationOptionsBase } from '../interfaces';

const URL_VALIDATION_OPTIONS = {
  // validatorjs naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  require_protocol: true,
  protocols: ['http', 'https'],
  // validatorjs naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  require_tld: false,
};

@Injectable()
export class ValidatorCustomService {
  constructor(private readonly config: ConfigService) {}

  isFilled(value: unknown): boolean {
    if (this.isString(value)) {
      return this.isNotEmpty(value as string);
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined;
  }

  isString(value: unknown): boolean {
    return typeof value === 'string';
  }

  isNotEmpty(value: string): boolean {
    return !validatorjs.isEmpty(value);
  }

  isNotEqualToField(
    value: string,
    targetField: string,
    { target }: CustomValidationOptionsBase,
  ): boolean {
    return value !== target[targetField];
  }

  isEqualToConfig(
    value: string,
    configName: string,
    configField: string,
  ): boolean {
    const { [configField]: fieldValue } =
      this.config.get<Record<string, unknown>>(configName);

    return value === fieldValue;
  }

  isIpAddressesAndRange(value: string): boolean {
    return validatorjs.isIP(value) || validatorjs.isIPRange(value);
  }

  isSignedResponseAlg(value: string): boolean {
    return ['ES256', 'RS256'].includes(value);
  }

  isWebsiteURL(value: string): boolean {
    return validatorjs.isURL(value, {
      // validatorjs naming
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
      protocols: ['https'],
    });
  }

  isRedirectURL(value: string): boolean {
    return validatorjs.isURL(value, URL_VALIDATION_OPTIONS);
  }

  /**
   * @todo #2235 Extract this custom validator to a dedicated lib or app
   */
  isValidRedirectURLList(
    _value: string,
    context: CustomValidationOptionsBase,
  ): boolean {
    const fieldName = 'redirect_uris';

    /**
     * Exclude non-URI values to avoid double error messages
     * on affected fields
     */
    const filledFields = (context.target[fieldName] as string[]).filter(
      (value) => this.isRedirectURL(value),
    );

    const sameHost = hasSameHost(filledFields);

    const hasSectorIdentifier = Boolean(
      context.target['sector_identifier_uri'],
    );

    return hasSectorIdentifier || sameHost;
  }

  /**
   * Validates if a value is true (for consent checkboxes).
   *
   * @param value - The value to validate
   * @returns True if the value is boolean true, false otherwise
   */
  isTrue(value: unknown): boolean {
    /**
     * @Todo #2436 Migration of form encoding to JSON
     * Pending the complete migration of forms to JSON,
     * consent checkboxes may return the string 'true'.
     *
     */
    return value === 'true' || value === true;
  }
}
