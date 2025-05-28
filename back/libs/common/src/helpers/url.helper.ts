import { isURL } from 'class-validator';

export function hasSameHost(urlList: string[]): boolean {
  if (urlList.length === 0) {
    return true;
  }

  const hasInvalidUrl = urlList.some((url) => isURL(url) === false);

  if (hasInvalidUrl) {
    return false;
  }

  const urlDomains = urlList.map((url) => {
    const { host } = new URL(url);
    return host;
  });

  const uniqueDomains = [...new Set(urlDomains)];

  return uniqueDomains.length === 1;
}
