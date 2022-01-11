/* istanbul ignore file */

/*
 * For yet undetermined reason, instanbul ignore stops to work in the files were this package is imported.
 * This barrel file is a workarround to import the package in an empty context,
 * this way istanbul will not trigger a coverage warning since there is no code at all.
 *
 * @Since 2021/12/15
 */
export { ClientOptions } from '@elastic/elasticsearch';
