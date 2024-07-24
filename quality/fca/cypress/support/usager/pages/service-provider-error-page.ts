const ERROR_URL_REGEXP =
  /^https:\/\/.*\/oidc-callback([?#])error=([^&]+)&error_description=([^&]+)&state=.+$/;
const URL_TYPE_GROUP = 1;

export default class ServiceProviderErrorPage {
  checkErrorCallbackUrl(url: string, containsQuery = true): void {
    const match = url.match(ERROR_URL_REGEXP);
    expect(match.length).to.equal(4);
    const delimitor = containsQuery ? '?' : '#';
    expect(match[URL_TYPE_GROUP]).to.equal(delimitor);
  }
}
