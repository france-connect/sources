import toKebabCase from 'lodash.kebabcase';

import { Strings } from '@fc/common';

import { CSSUnits } from '../../enums';
import type { MediaQueryInterface } from '../../interfaces';

const JOINER = `${Strings.WHITE_SPACE}and${Strings.WHITE_SPACE}`;

export function objectToMediaQuery(obj?: MediaQueryInterface | undefined) {
  const keys = obj && Object.keys(obj);
  if (!keys || keys.length === 0) {
    return Strings.EMPTY_STRING;
  }

  const mediaQueries = keys.map((key) => {
    const value = obj[key];
    const isString = typeof value === 'string';
    const cssValue = isString ? value : `${value}${CSSUnits.PIXEL}`;

    const cssProperty = toKebabCase(key);
    return `(${cssProperty}:${cssValue})`;
  });

  return mediaQueries.join(JOINER);
}
