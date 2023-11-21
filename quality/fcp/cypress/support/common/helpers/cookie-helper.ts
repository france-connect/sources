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

export const getCookieFromUrl = (
  cookieName: string,
  cookieUrl: string,
): Cypress.Chainable<Cypress.Cookie> => {
  const url = new URL(cookieUrl);
  const domain = url.hostname;
  return cy.getCookie(cookieName, { domain });
};
