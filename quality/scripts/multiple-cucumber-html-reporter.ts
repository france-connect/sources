/**
 * Generate a HTML report
 * @link https://github.com/WasiqB/multiple-cucumber-html-reporter
 */
import * as fs from 'fs';

import * as reporter from 'multiple-cucumber-html-reporter';

const GITLAB_PROJECT_URL =
  'https://gitlab.dev-franceconnect.fr/france-connect/fc';
const GITLAB_JOB_URL = `${GITLAB_PROJECT_URL}/-/jobs/`;
const GITLAB_MERGE_REQUEST_URL = `${GITLAB_PROJECT_URL}/-/merge_requests/`;

// Fetch Arguments
const [
  ,
  ,
  projectDir = '.',
  reportPath = `${projectDir}/cypress/reports/cucumber/html-report`,
] = process.argv;

// Retrieve test metadata

const metadataPath = `${projectDir}/cypress/reports/run-metadata.json`;
const { browser, ci, custom, platform } = JSON.parse(
  fs.readFileSync(metadataPath, 'utf8'),
);

const metadata = {
  browser,
  device: custom.runner,
  platform,
};

// Add metadata

const reportName = `${custom.app} ${ci.branch} (${custom.testEnv})`;

const gitMergeRequestId = ci.mergeRequest.split('!').pop();
const gitMergeRequestLink = ci.mergeRequest
  ? `<a href="${GITLAB_MERGE_REQUEST_URL}${gitMergeRequestId}">${ci.mergeRequest}</a>`
  : 'N/A';
const gitBuildLink = ci.buildId
  ? `<a href="${GITLAB_JOB_URL}${ci.buildId}">${ci.buildId}</a>`
  : 'local';

const customData = {
  data: [
    { label: 'Application', value: custom.app },
    { label: 'Environment', value: custom.testEnv },
    { label: 'Tag', value: ci.tag },
    { label: 'Branch', value: ci.branch },
    { label: 'Commit', value: ci.commit },
    { label: 'Merge Request', value: gitMergeRequestLink },
    { label: 'Build', value: gitBuildLink },
  ],
  title: 'Run info',
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
