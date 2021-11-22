const COMMAND = 'registerProxyURL';
const STEP_NAME = 'FC:proxy';

const STEP_KEY = 'FC:proxy';
/**
 * Allow to inject data in URL and apply it
 * @param {string} glob the URL pattern to intercept URL
 * @param {object} params data to inject in query
 */
export function registerProxyURL(glob, params = {}) {
  return cy
    .intercept(
      glob,
      (req) => {
        const { url, method } = req;
        const hasParams = params && Object.keys(params).length;
        if (hasParams) {
          Cypress.log({
            name: COMMAND,
            displayName: STEP_NAME,
            message: `Inject data for ${Object.keys(params)} in ${url}`,
            consoleProps: () => params,
          }).snapshot();

          if (method === 'GET') {
            const urlObject = new URL(url);

            Object.entries(params).forEach((param) => {
              urlObject.searchParams.set(...param);
            });

            req.url = urlObject.toString();
          } else {
            req.body = params;
          }
        } else {
          Cypress.log({
            name: COMMAND,
            displayName: STEP_NAME,
            message: `Ignore the URL: ${url}`,
          }).snapshot();
        }

        req.reply();
      },
      { log: false },
    )
    .as(STEP_KEY);
}

/**
 * Check if the registerProxyURL worked !
 */
export function proxyURLWasActivated() {
  cy.wait(`@${STEP_KEY}`);
}
