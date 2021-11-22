/**
 * Generate a HTML report
 * @link https://github.com/wswebcreation/multiple-cucumber-html-reporter
 */
import * as fs from 'fs-extra';

import * as reporter from 'multiple-cucumber-html-reporter';

const gitLabProjectUrl =
  'https://gitlab.dev-franceconnect.fr/france-connect/fc';
const gitLabJobUrl = `${gitLabProjectUrl}/-/jobs/`;
const gitLabMergeRequestUrl = `${gitLabProjectUrl}/-/merge_requests/`;

// Fetch Arguments
const [
  ,
  ,
  projectDir = '.',
  reportPath = `${projectDir}/cypress/reports/cucumber/html-report`,
] = process.argv;

// Fetch Test Run Context

const platformName = {
  'fca-low': 'AgentConnect',
  'fcp-high': 'FranceConnect+',
  'fcp-low': 'FranceConnect',
};

const platform = platformName[process.env.CYPRESS_PLATFORM] || 'N/A';
const testEnv = process.env.CYPRESS_TEST_ENV || 'docker';
const gitBranch = process.env.CI_COMMIT_REF_NAME || '';
const gitCommit = process.env.CI_COMMIT_SHORT_SHA || '';
const gitMergeRequest = process.env.CI_OPEN_MERGE_REQUESTS || 'N/A';
const gitBuild = process.env.CI_JOB_ID || 'local';
const device = gitBuild === 'local' ? 'Docker Local' : 'Docker GitLab';

// Add metadata

const reportName = `${platform} ${gitBranch} (${testEnv})`;

const gitMergeRequestId = gitMergeRequest.split('!').pop();
const gitMergeRequestLink =
  gitMergeRequest === 'N/A'
    ? 'N/A'
    : `<a href="${gitLabMergeRequestUrl}${gitMergeRequestId}">${gitMergeRequest}</a>`;
const gitBuildLink =
  gitBuild === 'local'
    ? gitBuild
    : `<a href="${gitLabJobUrl}${gitBuild}">${gitBuild}</a>`;
const customData = {
  data: [
    { label: 'Project', value: platform },
    { label: 'Environment', value: testEnv },
    { label: 'Branch', value: gitBranch },
    { label: 'Commit', value: gitCommit },
    { label: 'Merge Request', value: gitMergeRequestLink },
    { label: 'Build', value: gitBuildLink },
  ],
  title: 'Run info',
};

/**
 * @todo Make browser metadata dynamic
 * @author: Nicolas
 * @date: 11/06/2021
 */
const metadata = {
  browser: {
    name: 'chrome',
    version: '91',
  },
  device,
  platform: {
    name: 'linux',
    version: 'Debian 10',
  },
};

// Report options

/*
  All options
  const customMetadata = options.customMetadata || false;
  const customData = options.customData || null;
  const style = options.overrideStyle || REPORT_STYLESHEET;
  const customStyle = options.customStyle;
  const disableLog = options.disableLog;
  const openReportInBrowser = options.openReportInBrowser;
  const reportName = options.reportName || DEFAULT_REPORT_NAME;
  const reportPath = path.resolve(process.cwd(), options.reportPath);
  const saveCollectedJSON = options.saveCollectedJSON;
  const displayDuration = options.displayDuration || false;
  const displayReportTime = options.displayReportTime || false;
  const durationInMS = options.durationInMS || false;
  const hideMetadata = options.hideMetadata || false;
  const pageTitle = options.pageTitle || 'Multiple Cucumber HTML Reporter';
  const pageFooter = options.pageFooter || false;
  const useCDN = options.useCDN || false;
  const staticFilePath = options.staticFilePath || false;
*/

const options = {
  customData,
  displayDuration: true,
  displayReportTime: true,
  jsonDir: `${projectDir}/cypress/reports/cucumber`,
  metadata,
  pageTitle: reportName,
  reportName,
  reportPath,
};

reporter.generate(options);

// Move the screenshots into the assets folder
const originFolder = `${projectDir}/cypress/screenshots`;
const destinationFolder = `${reportPath}/assets/screenshots`;
if (fs.existsSync(originFolder)) {
  fs.copy(originFolder, destinationFolder, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      return console.error(err);
    }
    // eslint-disable-next-line no-console
    console.log('screenshots copied!');
  });
}
