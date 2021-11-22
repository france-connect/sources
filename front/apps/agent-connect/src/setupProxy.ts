/* istanbul ignore file */

// tooling file
/**
 * Proxy configuration middleware
 *
 * @see https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
 *
 * This proxy configuration middleware allows us to redirect traffic for development.
 *
 * It MUST be configured in two ways:
 *
 * @param {string} API_PROXY_HOST the full address to proxy calls to
 *  ie. `https://my-backend.lan:3000`
 *
 * @param {string} API_PROXY_FOR_PATH the path for which the proxy is applied
 *  ie. `/api`
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const { createProxyMiddleware } = require('http-proxy-middleware');

const { API_PROXY_FOR_PATH, API_PROXY_HOST } = process.env;

module.exports = app => {
  app.use(
    API_PROXY_FOR_PATH,
    createProxyMiddleware({
      changeOrigin: true,
      target: API_PROXY_HOST,
    }),
  );
};
