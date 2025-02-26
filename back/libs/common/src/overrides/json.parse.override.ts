import { OverrideCode } from '@fc/override-code';

import { overriddenBySafelyParseJson } from '../helpers';

OverrideCode.wrap(JSON, 'parse', 'JSON.parse');
OverrideCode.override('JSON.parse', overriddenBySafelyParseJson);
