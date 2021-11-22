/**
 * Adds response interceptions to replace SameSite=Lax cookie attributes by none
 * on the domains provided, as browsers would skip Set-Cookie headers with SameSite=Lax
 * initiated in Cypress iFrame.
 * @param domains domains used for the cross applications tests
 */
export const disableSameSiteLax = (domains: {
  [key: string]: string;
}): void => {
  Object.keys(domains).forEach((key) => {
    const excludeExtensions = '(?<!.css)(?<!.js)(?<!.png)(?<!.svg)(?<!.woff2)';
    const domainRegExp = new RegExp(`.*${domains[key]}.*${excludeExtensions}$`);
    cy.intercept(domainRegExp, (req) => {
      req.on('response', (res) => {
        const cookies = res.headers['set-cookie'];
        if (Array.isArray(cookies)) {
          const setCookieHeaders = cookies.map((strCookie) =>
            strCookie.replace(/samesite=(lax|strict)/i, 'samesite=none'),
          );
          res.headers['set-cookie'] = setCookieHeaders;
        }
      });
    }).as(`${key}:SameSiteLax`);
  });
};

/**
 * Removes all cookies
 */
export const clearAllCookies = (): void => {
  /**
   * @todo Unsupported way of clearing the cookies on all domains with Cypress
   * @link https://github.com/cypress-io/cypress/issues/408
   * author: Nicolas
   * date: 31/05/2021
   */
  // @ts-expect-error: domain is not an official option for clearCookies
  cy.clearCookies({ domain: null });
};
