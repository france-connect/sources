import fs from 'fs';
import path from 'path';

interface BrowserMetadata {
  name?: string;
  version?: string;
}

interface OSMetadata {
  name?: string;
  version?: string;
}

interface CypressMetadata {
  version?: string;
}

interface CIMetadata {
  branch?: string;
  commit?: string;
  mergeRequest?: string;
  buildId?: string;
  tag?: string;
}

interface CustomMetadata {
  app?: string;
  runner?: string;
  testEnv?: string;
}

interface FullMetadata {
  browser: BrowserMetadata;
  cypress: CypressMetadata;
  ci: CIMetadata;
  custom: CustomMetadata;
  platform: OSMetadata;
}

const metadata: FullMetadata = {
  browser: {},
  ci: {},
  custom: {},
  cypress: {},
  platform: {},
};

export const addMetadataPlugin = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Cypress.PluginConfigOptions => {
  // Capture browser metadata + write metadata file
  on('after:run', (results) => {
    // if the all test run failed (e.g., due to misconfiguration)
    if ('status' in results && results.status === 'failed') {
      return;
    }

    const runResults = results as CypressCommandLine.CypressRunResult;

    metadata.cypress = {
      version: runResults.cypressVersion,
    };

    metadata.platform = {
      name: runResults.osName,
      version: runResults.osVersion,
    };

    metadata.browser = {
      name: runResults.browserName,
      version: runResults.browserVersion,
    };

    metadata.ci = {
      branch: process.env.CI_COMMIT_REF_NAME || '',
      buildId: process.env.CI_JOB_ID || '',
      commit: process.env.CI_COMMIT_SHORT_SHA || '',
      mergeRequest: process.env.CI_OPEN_MERGE_REQUESTS || '',
      tag: process.env.CI_COMMIT_TAG || '',
    };

    metadata.custom = {
      app: runResults.config.env.APP_LABEL || 'N/A',
      runner: process.env.CI ? 'GitLab CI' : 'Local',
      testEnv: process.env.CYPRESS_TEST_ENV || 'docker',
    };

    const outputPath = path.join(
      config.projectRoot,
      'cypress/reports/run-metadata.json',
    );

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
  });

  return config;
};
