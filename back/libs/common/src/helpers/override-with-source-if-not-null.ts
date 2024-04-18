import { mergeWith } from 'lodash';

export function overrideWithSourceIfNotNull(destValue, srcValue) {
  const customizer = (dest, src) => {
    if (dest && src === null) {
      return dest;
    }

    return src;
  };

  return mergeWith({}, destValue, srcValue, customizer);
}
