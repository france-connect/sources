import { pinoLevelsMap } from '../log-maps.map';

export type LoggerTransport = Record<keyof typeof pinoLevelsMap, Function>;
