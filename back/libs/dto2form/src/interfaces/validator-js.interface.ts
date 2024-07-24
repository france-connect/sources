/* istanbul ignore file */

// declarative file
import validator from 'validator';

import {
  IbanCode,
  LicensePlateLocale,
  PassportNumberCountryCode,
  TaxIDLocale,
  ValidatorJs,
  VATCountryCode,
} from '../enums';
import { FieldValidatorBase } from './field-validator.interface';

/*
 ** ContainsValidator
 */

export interface ContainsValidator extends FieldValidatorBase {
  name: ValidatorJs.CONTAINS;

  validationArgs: [seed: string, options?: validator.ContainsOptions];
}

/*
 ** EqualsValidator
 */

export interface EqualsValidator extends FieldValidatorBase {
  name: ValidatorJs.EQUALS;

  validationArgs: [comparison: string];
}

/*
 ** IsAfterValidator
 */

export interface IsAfterValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_AFTER;

  validationArgs: [date?: string];
}

/*
 ** IsAlphaValidator
 */

export interface IsAlphaValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_ALPHA;

  validationArgs: [
    locale?: validator.AlphaLocale,
    options?: validator.IsAlphaOptions,
  ];
}

/*
 ** IsAlphanumericValidator
 */

export interface IsAlphanumericValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_ALPHANUMERIC;

  validationArgs: [
    locale?: validator.AlphaLocale,
    options?: validator.IsAlphanumericOptions,
  ];
}

/*
 ** IsAsciiValidator
 */

export interface IsAsciiValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_ASCII;
}

/*
 ** IsBase32Validator
 */

export interface IsBase32Options {
  crockford?: boolean;
}

export interface IsBase32Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_BASE32;

  validationArgs: [options?: IsBase32Options];
}

/*
 ** IsBase58Validator
 */

export interface IsBase58Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_BASE58;
}

/*
 ** IsBase64Validator
 */

export interface IsBase64Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_BASE64;

  validationArgs: [options?: validator.IsBase64Options];
}

/*
 ** IsBeforeValidator
 */

export interface IsBeforeValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_BEFORE;

  validationArgs: [date?: string];
}

/*
 ** IsBICValidator
 */

export interface IsBICValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_BIC;
}

/*
 ** IsBooleanValidator
 */

export interface IsBooleanOptions {
  loose?: boolean;
}

export interface IsBooleanValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_BOOLEAN;

  validationArgs: [options?: IsBooleanOptions];
}

/*
 ** IsBtcAddressValidator
 */

export interface IsBtcAddressValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_BTC_ADDRESS;
}

/*
 ** IsByteLengthValidator
 */

export interface IsByteLengthValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_BYTE_LENGTH;

  validationArgs: [options?: validator.IsByteLengthOptions];
}

/*
 ** IsCreditCardValidator
 */

export interface IsCreditCardValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_CREDIT_CARD;

  validationArgs: [options?: validator.IsCreditCardOptions];
}

/*
 ** IsCurrencyValidator
 */

export interface IsCurrencyValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_CURRENCY;

  validationArgs: [options?: validator.IsCurrencyOptions];
}

/*
 ** IsDataURIValidator
 */

export interface IsDataURIValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_DATA_URI;
}

/*
 ** IsDateValidator
 */

export interface IsDateValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_DATE;

  validationArgs: [options?: validator.IsDateOptions];
}

/*
 ** IsDecimalValidator
 */

export interface IsDecimalValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_DECIMAL;

  validationArgs: [options?: validator.IsDecimalOptions];
}

/*
 ** IsDivisibleByValidator
 */

export interface IsDivisibleByValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_DIVISIBLE_BY;

  validationArgs: [num: number];
}

/*
 ** IsEANValidator
 */

export interface IsEANValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_EAN;
}

/*
 ** IsEmailValidator
 */

export interface IsEmailValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_EMAIL;

  validationArgs: [options?: validator.IsEmailOptions];
}

/*
 ** IsEmptyValidator
 */

export interface IsEmptyValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_EMPTY;
}

/*
 ** IsEthereumAddressValidator
 */

export interface IsEthereumAddressValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_ETHEREUM_ADDRESS;
}

/*
 ** IsFloatValidator
 */

export interface IsFloatValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_FLOAT;

  validationArgs: [options?: validator.IsFloatOptions];
}

/*
 ** IsFQDNValidator
 */

export interface IsFQDNValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_FQDN;

  validationArgs: [options?: validator.IsFQDNOptions];
}

/**
 ** IsFreightContainerIDValidator
 */

export interface IsFreightContainerIDValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_FREIGHT_CONTAINER_ID;
}

/*
 ** IsFullWidthValidator
 */

export interface IsFullWidthValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_FULL_WIDTH;
}

/*
 ** IsHalfWidthValidator
 */

export interface IsHalfWidthValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_HALF_WIDTH;
}

/*
 ** IsHashValidator
 */

export interface IsHashValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_HASH;

  validationArgs: [algorithm: validator.HashAlgorithm];
}

/*
 ** IsHexadecimalValidator
 */

export interface IsHexadecimalValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_HEXADECIMAL;
}

/*
 ** IsHexColorValidator
 */

export interface IsHexColorValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_HEX_COLOR;
}

/*
 ** IsHSLValidator
 */

export interface IsHSLValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_HSL;
}

/*
 ** IsIBANValidator
 */

export interface IsIBANOptions {
  whitelist?: IbanCode[];
  blacklist?: IbanCode[];
}

export interface IsIBANValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_IBAN;

  validationArgs: [options?: IsIBANOptions];
}

/*
 ** IsIdentityCardValidator
 */

export interface IsIdentityCardValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_IDENTITY_CARD;

  validationArgs: [locale?: validator.IdentityCardLocale];
}

/*
 ** IsIMEIValidator
 */

export interface IsIMEIValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_IMEI;

  validationArgs: [options?: validator.IsIMEIOptions];
}

/*
 ** IsInValidator
 */

export interface IsInValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_IN;

  validationArgs: [values: string[]];
}

/*
 ** IsIntValidator
 */

export interface IsIntValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_INT;

  validationArgs: [options?: validator.IsIntOptions];
}

/*
 ** IsIPValidator
 */

export interface IsIPValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_IP;

  validationArgs: [version?: validator.IPVersion];
}

/*
 ** IsIPRangeValidator
 */

export interface IsIPRangeValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_IP_RANGE;

  validationArgs: [version?: validator.IPVersion];
}

/*
 ** IsISBNValidator
 */

export interface IsISBNOptions {
  version?: validator.ISBNVersion;
}

export interface IsISBNValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_ISBN;

  validationArgs: [options?: IsISBNOptions];
}

/*
 ** IsISINValidator
 */

export interface IsISINValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_ISIN;
}

/*
 ** IsISO6346Validator
 */

export interface IsISO6346Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_ISO6346;
}

/*
 ** IsISO6391Validator
 */

export interface IsISO6391Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_ISO6391;
}

/*
 ** IsISO8601Validator
 */

export interface IsISO8601Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_ISO8601;

  validationArgs: [options?: validator.IsISO8601Options];
}

/*
 ** IsISO31661Alpha2Validator
 */

export interface IsISO31661Alpha2Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_ISO31661_ALPHA2;
}

/*
 ** IsISO31661Alpha3Validator
 */

export interface IsISO31661Alpha3Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_ISO31661_ALPHA3;
}

/*
 ** IsISO4217Validator
 */

export interface IsISO4217Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_ISO4217;
}

/*
 ** IsISRCValidator
 */

export interface IsISRCValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_ISRC;
}

/*
 ** IsISSNValidator
 */

export interface IsISSNValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_ISSN;

  validationArgs: [options?: validator.IsISSNOptions];
}

/*
 ** IsJSONValidator
 */

export interface IsJSONOptions {
  allowPrimitives?: boolean;
}

export interface IsJSONValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_JSON;

  validationArgs: [options?: IsJSONOptions];
}

/*
 ** IsJWTValidator
 */

export interface IsJWTValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_JWT;
}

/*
 ** IsLatLongValidator
 */

export interface IsLatLongOptions {
  checkDMS?: boolean;
}

export interface IsLatLongValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_LAT_LONG;

  validationArgs: [options?: IsLatLongOptions];
}

/*
 ** IsLengthValidator
 */

export interface IsLengthValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_LENGTH;

  validationArgs: [options?: validator.IsLengthOptions];
}

/*
 ** IsLicensePlateValidator
 */

export interface IsLicensePlateValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_LICENSE_PLATE;

  validationArgs: [locale: LicensePlateLocale];
}

/*
 ** IsLocaleValidator
 */

export interface IsLocaleValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_LOCALE;
}

/*
 ** IsLowercaseValidator
 */

export interface IsLowercaseValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_LOWERCASE;
}

/*
 ** IsLuhnNumberValidator
 */

export interface IsLuhnNumberValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_LUHN_NUMBER;
}

/*
 ** IsMACAddressValidator
 */

export interface IsMACAddressValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_MAC_ADDRESS;

  validationArgs: [options?: validator.IsMACAddressOptions];
}

/*
 ** IsMagnetURIValidator
 */

export interface IsMagnetURIValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_MAGNET_URI;
}

/*
 ** IsMailtoURIValidator
 */

export interface IsMailtoURIValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_MAILTO_URI;

  validationArgs: [options?: validator.IsEmailOptions];
}

/*
 ** IsMD5Validator
 */

export interface IsMD5Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_MD5;
}

/*
 ** IsMimeTypeValidator
 */

export interface IsMimeTypeValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_MIME_TYPE;
}

/*
 ** IsMobilePhoneValidator
 */

export interface IsMobilePhoneOptions {
  strictMode?: boolean;
}

export interface IsMobilePhoneValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_MOBILE_PHONE;

  validationArgs: [
    locale?: validator.MobilePhoneLocale,
    options?: IsMobilePhoneOptions,
  ];
}

/*
 ** IsMongoIdValidator
 */

export interface IsMongoIdValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_MONGO_ID;
}

/*
 ** IsMultibyteValidator
 */

export interface IsMultibyteValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_MULTIBYTE;
}

/*
 ** IsNumericValidator
 */

export interface IsNumericValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_NUMERIC;

  validationArgs: [options?: validator.IsNumericOptions];
}

/*
 ** IsOctalValidator
 */

export interface IsOctalValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_OCTAL;
}

/*
 ** IsPassportNumberValidator
 */

export interface IsPassportNumberValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_PASSPORT_NUMBER;

  validationArgs: [countryCode?: PassportNumberCountryCode];
}

/*
 ** IsPortValidator
 */

export interface IsPortValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_PORT;
}

/*
 ** IsPostalCodeValidator
 */

export interface IsPostalCodeValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_POSTAL_CODE;

  validationArgs: [locale: validator.PostalCodeLocale];
}

/*
 ** IsRFC3339Validator
 */

export interface IsRFC3339Validator extends FieldValidatorBase {
  name: ValidatorJs.IS_RFC3339;
}

/*
 ** IsRgbColorValidator
 */

export interface IsRgbColorValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_RGB_COLOR;

  validationArgs: [includePercentValues?: boolean];
}

/*
 ** IsSemVerValidator
 */

export interface IsSemVerValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_SEM_VER;
}

/*
 ** IsSurrogatePairValidator
 */

export interface IsSurrogatePairValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_SURROGATE_PAIR;
}

/*
 ** IsUppercaseValidator
 */

export interface IsUppercaseValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_UPPERCASE;
}

/*
 ** IsSlugValidator
 */

export interface IsSlugValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_SLUG;
}

/*
 ** IsStrongPasswordValidator
 */

export interface IsStrongPasswordValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_STRONG_PASSWORD;

  validationArgs: [options?: validator.StrongPasswordOptions];
}

/*
 ** IsTimeValidator
 */

export interface IsTimeValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_TIME;

  validationArgs: [options?: validator.IsTimeOptions];
}

/*
 ** IsTaxIDValidator
 */

export interface IsTaxIDValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_TAX_ID;

  validationArgs: [locale: TaxIDLocale];
}

/*
 ** IsURLValidator
 */

export interface IsURLValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_URL;

  validationArgs: [options?: validator.IsURLOptions];
}

/*
 ** IsUUIDValidator
 */

export interface IsUUIDValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_UUID;

  validationArgs: [version?: validator.UUIDVersion];
}

/*
 ** IsVariableWidthValidator
 */

export interface IsVariableWidthValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_VARIABLE_WIDTH;
}

/*
 ** IsVATValidator
 */

export interface IsVATValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_VAT;

  validationArgs: [countryCode: VATCountryCode];
}

/*
 ** IsWhitelistedValidator
 */

export interface IsWhitelistedValidator extends FieldValidatorBase {
  name: ValidatorJs.IS_WHITELISTED;

  validationArgs: [chars: string | string[]];
}

/*
 ** MatchesValidator
 */

export interface MatchesValidator extends FieldValidatorBase {
  name: ValidatorJs.MATCHES;

  validationArgs: [pattern: RegExp | string, modifiers?: string];
}
