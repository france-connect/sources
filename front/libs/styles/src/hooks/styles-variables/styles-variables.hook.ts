import { useMemo } from 'react';

import { Strings as CommonStrings } from '@fc/common';

import { Strings } from '../../enums';
import { useStylesContext } from '../styles-context';

type TransformerFunc<T> = (value: string) => T;

export const useStylesVariables = <T extends string>(
  cssVariableNames: string | string[],
  transformer?: TransformerFunc<T> | TransformerFunc<T>[],
): (string | undefined | ReturnType<TransformerFunc<T>>)[] => {
  const { cssVariables } = useStylesContext();

  const stylesObject = useMemo(() => {
    const cssNames = typeof cssVariableNames === 'string' ? [cssVariableNames] : cssVariableNames;
    return cssNames
      .map((cssName) => {
        const prefix = cssName.startsWith(Strings.DOUBLE_DASH)
          ? CommonStrings.EMPTY_STRING
          : Strings.DOUBLE_DASH;
        const name = `${prefix}${cssName}`;
        const value = cssVariables && cssVariables.getPropertyValue(name).trim();
        return value || undefined;
      })
      .map(
        (cssValue, index) => {
          const transformerFunc = Array.isArray(transformer) ? transformer[index] : transformer;
          const nextValue = cssValue && transformerFunc ? transformerFunc(cssValue) : cssValue;
          return nextValue;
        },
        [cssVariables],
      );
  }, [cssVariableNames, cssVariables, transformer]);

  return stylesObject;
};
