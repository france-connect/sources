/**
 * Add Screenshot and Video attachments to the Cucumber logs
 */

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

import {
  IJsonFeature,
  IJsonStep,
} from '@cucumber/cucumber/lib/formatter/json_formatter';

// Fetch Arguments
const [
  ,
  ,
  cucumberDirPath = 'cypress/reports/cucumber',
  screenshotsPath = 'cypress/screenshots',
  videosPath = 'cypress/videos',
] = process.argv;

// Init
const cucumberMap: { [key: string]: IJsonFeature } = {};
const cucumberFileMap: { [key: string]: string } = {};

// Functions

/**
 * Retrieves the first failed step inside a scenario
 * @param {IJsonFeature} cuke feature based on Cucumber Json schema
 * @param {string} scenarioName name of the scenario
 * @returns {IJsonStep | undefined} the failed step or null
 */
const getFailedStepFromScenario = (
  cuke: IJsonFeature,
  scenarioName: string,
): IJsonStep | undefined => {
  const myScenario = cuke.elements.find(
    (e) => e.name.replace(/"/g, '') === scenarioName,
  );
  const myStep = myScenario?.steps.find(
    (step) => step.result.status !== 'passed',
  );
  return myStep;
};

/**
 * Add screenshot link to the step
 * @param {string} screenshotPath absolute path to the screenshot
 * @param {IJsonStep} step step to add the screenshot
 */
const addScreenshotToStep = (screenshotPath: string, step: IJsonStep): void => {
  const regExp = new RegExp(`^(?:.*${screenshotsPath})(.*/)([^/]*)$`);
  const found = regExp.exec(screenshotPath);
  if (!found) {
    return;
  }
  const [, screenshotFolder, screenshotName] = found;
  const encodedPath = `../assets/screenshots${encodeURI(screenshotFolder)}\
${encodeURIComponent(screenshotName)}`;
  const screenshotImage = `<img class="screenshot" src="${encodedPath}" />`;
  if (!step.embeddings) {
    step.embeddings = [];
  }
  step.embeddings.push({ data: screenshotImage, mime_type: 'text/html' });
};

/**
 * Provides a HTML container with the video
 * @param {string} videoPath absolute path to the video
 * @returns {string} html content with link to the video
 */
const videoContainer = (videoPath: string): string => {
  const videoHTML = `
  <a href="#video" data-toggle="collapse" class="collapsed">+ Show Video</a>
  <div id="video" class="scenario-step-collapse collapse" aria-expanded="false" style="height: 0px;">
    <div class="info">
      <video controls="" width="500"><source type="video/mp4" src="${encodeURI(
        videoPath,
      )}"></video>
    </div>
  </div>`;
  return videoHTML;
};

// Main functions

/**
 * Reads the Cucumber Json files and updates the maps
 * @param {string} cukeDirPath path to the folder containing the cucumber jon files
 * @param {Object} cukeFileMap map linking the feature to the cucumber json file name
 * @param {Object} cukeMap map linking the feature to the cucumber json content
 */
const readCucumberFiles = (
  cukeDirPath: string,
  cukeFileMap: { [key: string]: string },
  cukeMap: { [key: string]: IJsonFeature },
): void => {
  // For all cucumber json files
  fs.readdirSync(cukeDirPath, { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name)
    .forEach((fileName) => {
      // For each feature
      const arr = fileName.split('.');
      const featureName = `${arr[0]}.feature`;
      const json = JSON.parse(
        fs.readFileSync(path.join(cukeDirPath, fileName)).toString(),
      );
      // Keep the file name
      cukeFileMap[featureName] = fileName;
      // Keep the cucumber json content
      // The IJsonFeature object is in one array of one element
      cukeMap[featureName] = json[0];
    });
};

/**
 * Add the video links to the Cucumber Json
 * @param {string} videosDirPath path to the folder containing the Cypress videos
 * @param {Object} cukeMap map linking the feature to the cucumber json content
 */
const addVideoLinks = (
  videosDirPath: string,
  cukeMap: { [key: string]: IJsonFeature },
): void => {
  // For each Cypress video (local execution)
  glob
    .sync(`${videosDirPath}/**/*.mp4`)
    .map((videoPath) => ({
      featureName: path.basename(videoPath, '.mp4'),
      videoAbsolutePath: path.resolve(videoPath),
    }))
    .filter(({ featureName }) => !!cukeMap[featureName])
    .forEach(({ featureName, videoAbsolutePath }) => {
      // Append the description with the video link
      const videoLink = videoContainer(videoAbsolutePath);
      const featureDescription = `${cukeMap[featureName].description}\n<br />${videoLink}`;
      cukeMap[featureName].description = featureDescription;
    });
};

/**
 * Add the screenshot links to the Cucumber Json
 * @param {string} screenshotsDirPath path to the folder containing the Cypress screenshots
 * @param {Object} cukeMap map linking the feature to the cucumber json content
 */
const addScreenshotLinks = (
  screenshotsDirPath: string,
  cukeMap: { [key: string]: IJsonFeature },
): void => {
  // For each Cypress screenshot
  glob
    .sync(`${screenshotsDirPath}/**/*.png`)
    .map((screenshotPath) => {
      return {
        featureName: path.basename(path.dirname(screenshotPath)),
        screenshotName: path.basename(screenshotPath),
        screenshotPath,
      };
    })
    .filter(({ featureName }) => !!cukeMap[featureName])
    .forEach(({ featureName, screenshotName, screenshotPath }) => {
      const scenarioName = screenshotName
        .match(/--\s(.+).png/)[1]
        .replace('(failed)', '')
        .replace(/\(example #\d+\)/, '')
        .trim();

      // Add the screenshot to the failed step
      const myStep = getFailedStepFromScenario(
        cukeMap[featureName],
        scenarioName,
      );
      if (myStep) {
        addScreenshotToStep(screenshotPath, myStep);
      }
    });
};

/**
 * Overrides the Cucumber Json files with the Json content including the links
 * @param {string} cukeDirPath path to the folder containing the cucumber jon files
 * @param {Object} cukeFileMap map linking the feature to the cucumber json file name
 * @param {Object} cukeMap map linking the feature to the cucumber json content
 */
const overrideCucumberFiles = (
  cukeDirPath: string,
  cukeFileMap: { [key: string]: string },
  cukeMap: { [key: string]: IJsonFeature },
): void => {
  Object.entries(cukeMap).forEach(([featureName, featureJson]) => {
    // Update the Cucumber logs
    fs.writeFileSync(
      path.join(cukeDirPath, cukeFileMap[featureName]),
      // The IJsonFeature object is in one array of one element
      JSON.stringify([featureJson], null, 2),
    );
  });
};

// Run

readCucumberFiles(cucumberDirPath, cucumberFileMap, cucumberMap);
addVideoLinks(videosPath, cucumberMap);
addScreenshotLinks(screenshotsPath, cucumberMap);
overrideCucumberFiles(cucumberDirPath, cucumberFileMap, cucumberMap);
