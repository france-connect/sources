#!/usr/bin/env node

/* --------------------------------------

Executed into instances/(app directory)

-------------------------------------- */

const path = require('path');
const fse = require('fs-extra');
const chokidar = require('chokidar');

const [, , APP_NAME] = process.argv;
const APPS_FOLDER = path.join('..', '..', 'apps', APP_NAME);
const APPS_WATCHABLES = ['_data', '_includes', 'content', 'public'];

// @TODO
// async function removeFile(filepath) {
//   await fse.remove(filepath);
//   console.log(`${filepath} has been removed`);
// }

async function copyFile(filepath) {
  try {
    const file = path.join(APPS_FOLDER, filepath);
    await fse.copyFile(file, filepath);
    console.log(`[${APP_NAME}] file copied`, filepath);
  } catch (err) {
    console.error(`Unable to copy file [${filepath}]`, err);
  }
}

async function addDirectory(path) {
  try {
    await fse.ensureDir(path);
    console.log(`[${APP_NAME}] directory has been created`, path);
  } catch (err) {
    console.error(`Unable to create folder [${path}]`, err);
  }
}

function initialize() {
  const appsfiles = APPS_WATCHABLES.map((name) => path.join(APPS_FOLDER, name));
  const watcher = chokidar.watch(appsfiles, {
    ignoreInitial: true,
    persistent: true,
    cwd: APPS_FOLDER,
  });

  watcher
    // @TODO when removing a Folder/File,
    // if the folder is a 'root' folder (_includes, content, layouts...)
    // it breaks the 11TY watch
    // .on('unlinkDir', remove)
    // .on('unlink', removeFile)
    .on('add', copyFile)
    .on('change', copyFile)
    .on('addDir', addDirectory)
    .on('error', (error) => console.log(`[${APP_NAME}] Watcher error: ${error}`))
    .on('ready', () => console.log(`[${APP_NAME}] Initial scan complete. Ready for changes`));
}

initialize();
