import * as colors from '../constants';
import { ILoggerColorParams } from '../interfaces';

/**
 * Convert textual string into an hexadecimal color.
 * @see https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
 *
 * @param {string} str String to convert
 * @returns {string} hexadecimal color.
 */
export const stringToColor = (str: string): string => {
  let hash = 0;
  let color = '#';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

/**
 * Convert from hexadecimal color onto its opposite luminosity
 * in an hexadecimal value, either black (#000000) or white (#FFFFFF).
 * Ex: #F0F0F0 > #000000
 * Ex: #0F0F0F > #FFFFFF
 *
 * @param {string} hexadecimal color.
 * @returns {string} hexadecimal oposite luminosity color either black or white.
 */
export function getInvertColor(hex: string): string {
  // remove #
  let value: string = hex.slice(1);

  // Hex color are 3 or 6 size
  if (![6, 3].includes(value.length)) {
    throw new Error('Invalid HEX color.');
  }

  // always 6 digits color
  if (value.length === 3) {
    const [r, g, b] = value;
    value = r + r + g + g + b + b;
  }
  // extract color params
  const [r, g, b] = value
    .match(/.{1,2}/g)
    .map((c: string): number => parseInt(c, 16));

  // Opposite Contrast algorithm
  return r * 0.299 + g * 0.587 + b * 0.114 > 186
    ? colors.loggerLuminosityColorsConstant.BLACK
    : colors.loggerLuminosityColorsConstant.WHITE;
}

export const getColorsFromText: Function = (
  context: string,
): ILoggerColorParams => {
  const colorName: string = stringToColor(context);
  return {
    BACKGROUND_COLOR: colorName,
    TEXT_COLOR: getInvertColor(colorName),
  };
};

/**
 * Helper function to set common Chrome debug style.
 *
 * @param {ILoggerColorParams} color object.
 * @returns {Array<string>} Style to apply to the current Chrome debug tool line.
 */
export const getStyle: Function = (color: ILoggerColorParams): string =>
  [
    'font-size: 11px;',
    'font-weight: 400;',
    'margin: 1px;',
    'padding: 2px;',
    'border-radius: 3px;',
    `color: ${
      color ? color.TEXT_COLOR : colors.loggerLuminosityColorsConstant.WHITE
    };`,
    `background-color: ${
      color
        ? color.BACKGROUND_COLOR
        : colors.loggerLuminosityColorsConstant.BLACK
    };`,
  ].join('\n');
