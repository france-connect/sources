export function hasSameHost(urlList: string[]): boolean {
  if (urlList.length === 0) {
    return true;
  }

  const urlDomains = urlList.map((url) => {
    const { host } = new URL(url);
    return host;
  });

  const uniqueDomains = [...new Set(urlDomains)];

  return uniqueDomains.length === 1;
}
