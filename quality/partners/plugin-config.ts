import basePluginConfig from '../plugins';

const pluginConfig = async (
  cypressOn: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> => {
  await basePluginConfig(cypressOn, config);

  config.baseUrl = getBaseUrl(config.env.TEST_ENV);

  return config;
};

const getBaseUrl = (testEnv: string): string => {
  const baseUrls = {
    docker: 'https://partners.docker.dev-franceconnect.fr/',
    integ01: 'https://espace-partenaires.integ01.dev-franceconnect.fr/',
  };
  const baseUrl = baseUrls[testEnv];
  return baseUrl;
};

export default pluginConfig;
