/* istanbul ignore file */

// Declarative file
/**
 * To prevent circular dependencies, helpers are not exposed through
 * module root barrel file.
 *
 * One must import helpers with `/helpers`, exemple:
 *
 * import { extractNetworkInfoFromHeaders } from '@fc/tracking/helpers';
 */
export * from './extract-network-context.helper';
