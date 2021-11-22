/* istanbul ignore file */

/**
 * This file triggers override of native or installed libraries
 *
 * We need to override some components of JOSE to use HSM instead of native node crypto
 */
/**
 * Wrap cryptos method used by JOSE to inject our HSM calls
 */
import * as crypto from 'crypto';

import { OverrideCode } from '../helpers';

OverrideCode.wrap(crypto, 'sign', 'crypto.sign');
