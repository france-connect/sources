export const addInterceptHeaders = (
  headers: Record<string, string>,
  interceptName: string,
): void => {
  cy.intercept(/.*dev-franceconnect.fr.*/, (req) => {
    req.headers = {
      ...req.headers,
      ...headers,
    };
  }).as(interceptName);
};

export const addInterceptParams = (
  routeMatcher: string | RegExp,
  params: Record<string, string>,
  interceptName: string,
): void => {
  cy.intercept(routeMatcher, (req) => {
    const { body, headers, method, url } = req;
    if (method === 'GET') {
      const urlObject = new URL(url);

      Object.entries(params).forEach((param) => {
        urlObject.searchParams.set(...param);
      });

      req.url = urlObject.toString();
      Cypress.log({
        consoleProps: () => params,
        displayName: interceptName,
        message: `Add the params ${JSON.stringify(params)} to the req url '${
          req.url
        }'`,
        name: 'addInterceptParams',
      }).snapshot();
    }
    if (
      method === 'POST' &&
      headers['content-type'] === 'application/x-www-form-urlencoded'
    ) {
      const searchParams = new URLSearchParams(body);

      Object.entries(params).forEach((param) => {
        searchParams.set(...param);
      });

      req.body = searchParams.toString();

      Cypress.log({
        consoleProps: () => params,
        displayName: interceptName,
        message: `Add the params ${JSON.stringify(params)} to the req body '${
          req.body
        }'`,
        name: 'addInterceptParams',
      }).snapshot();
    }
    req.reply();
  }).as(interceptName);
};
