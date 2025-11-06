import { Strings } from '@fc/common';

import { RedirectException } from '../../exceptions';

export const redirectToUrl = (url: string = Strings.EMPTY_STRING): void => {
  try {
    if (url.trim().length === 0) {
      throw new Error('URL is empty or whitespace only');
    }
    const { href } = new URL(url, window.location.origin);
    window.location.href = href;
  } catch (error: unknown) {
    throw new RedirectException(error as Error);
  }
};
