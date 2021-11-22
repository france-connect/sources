/* istanbul ignore file */

// declarative code
import { ILoggerColorConstant, ILoggerColorParams } from '../interfaces';

export const loggerTimeColorsConstant: ILoggerColorParams = {
  BACKGROUND_COLOR: '#555',
  TEXT_COLOR: '#FFF',
};

export const loggerClassMethodColorsConstant: ILoggerColorParams = {
  BACKGROUND_COLOR: '#EAEAEA',
  TEXT_COLOR: '#222',
};

export const loggerLuminosityColorsConstant: ILoggerColorConstant = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
};

/**
 * Some class extensions' types are treated differently to
 * display them with special attention in Chrome Debuger Tool.
 */
//getSpecificClassColorsConstants
export enum loggerColorClassCategoryEnum {
  Controller = '#88A9FC',
  Adapter = '#F4D746',
  MongoService = '#e177ff',
  Handler = '#8ddd8d',
  ExceptionFilter = '#f76262',
}
