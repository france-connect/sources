const FC_SESSION_COOKIE = 'fc_session_id';

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

export const setUnknowSessionIdInSessionCookie = (cookieUrl: string): void => {
  const url = new URL(cookieUrl);
  const domain = url.hostname;
  const cookieValue =
    's%3Aaaaaaa559244e12db08e445edfb6fc39e20055a03f3e3618d3f18d907055276a94d2146dc999ab8c07bd45120f93fa03c8c2e30cb4497a349f299bb4384d7449.x5K8E3fK00eFl1yRIlvArTJQd373CHg7yQ7h1ZEsoKw';
  const cookieOptions: Partial<Cypress.SetCookieOptions> = {
    domain: `.${domain}`,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: true,
  };
  cy.setCookie(FC_SESSION_COOKIE, cookieValue, cookieOptions);
};

export const checkCookieExists = (
  cookieName: string,
  domain: string,
  isSessionCookie = false,
): void => {
  const chainers = isSessionCookie ? 'not.have.property' : 'have.property';
  cy.getCookie(cookieName, { domain })
    .should('exist')
    .should(chainers, 'expiry');
};
