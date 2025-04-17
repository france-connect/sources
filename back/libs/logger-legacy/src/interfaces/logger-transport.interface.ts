import { AsyncFunctionSafe, FunctionSafe } from '@fc/common';

import { pinoLevelsMap } from '../log-maps.map';

export type LoggerTransport = Record<
  keyof typeof pinoLevelsMap,
  FunctionSafe | AsyncFunctionSafe
>;
