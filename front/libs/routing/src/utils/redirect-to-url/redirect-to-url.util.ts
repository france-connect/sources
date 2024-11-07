import { RedirectException } from '../../exceptions';

export const redirectToUrl = (url: string = ''): void => {
  try {
    if (url.trim().length === 0) {
      throw new Error('URL is empty or whitespace only');
    }
    const { href } = new URL(url, window.location.origin);
    window.location.href = href;
  } catch (e) {
    throw new RedirectException();
  }
};
