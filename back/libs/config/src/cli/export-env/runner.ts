import * as ejs from 'ejs';
import { readFile, writeFile } from 'fs/promises';
import * as glob from 'glob';

import { MarkdownGenerator } from './markdown-generator';

const TEMPLATE_FILE = `${__dirname}/views/env-vars.ejs`;
const FILE_SEARCH_PATTERN = 'instances/*/src/config/*.ts';
const DEST_FILE = '_doc/env-vars.md';

const CONFIG_PREFIX_REGEX = /new ConfigParser\(process\.env, '(\w+)'\)/;
const PROCESS_ENV_REGEX = /process\.env[\n\r\s]*\.(\w+)/g;
const CONFIG_ENV_REGEX = /env\.(\w+)\([\n\r\s]*'(\w+)'/g;

export class Runner {
  static async run(): Promise<void> {
    console.log('Generating documentation for env vars...');

    const paths = Runner.getConfigFilesPath();
    const configFiles = await Runner.loadConfigs(paths);

    const envVarsMap = Runner.buildEnvMap(configFiles);

    const markdown = MarkdownGenerator.generate(envVarsMap);
    const page = await Runner.renderFile(TEMPLATE_FILE, {
      markdown,
    });

    await writeFile(DEST_FILE, page);
  }

  static getConfigFilesPath(searchPattern = FILE_SEARCH_PATTERN): string[] {
    const paths = glob.sync(searchPattern);
    return paths;
  }

  static async loadConfigs(paths: string[]): Promise<any> {
    const infos = paths.map((path) => readFile(path, 'utf-8'));
    const files = await Promise.all(infos);

    return files.map((file, index) => ({ path: paths[index], file }));
  }

  static buildEnvMap(files: { path: string; file: string }[]): object {
    const envMap = files.reduce(Runner.filesReducer, {});

    return envMap;
  }

  static filesReducer(envMap, { path, file }) {
    const instanceName = path.split('/')[1];
    const configPrefix = file.match(CONFIG_PREFIX_REGEX)?.[1];

    if (!envMap[instanceName]) {
      envMap[instanceName] = {};
    }

    const processEnvVars = [...file.matchAll(PROCESS_ENV_REGEX)];
    processEnvVars.forEach(([, name]) => {
      envMap[instanceName][name] = 'string';
    });

    const configEnvVars = [...file.matchAll(CONFIG_ENV_REGEX)];
    configEnvVars.forEach(([, type, name]) => {
      envMap[instanceName][`${configPrefix}_${name}`] = type;
    });

    return envMap;
  }

  static async renderFile(file: string, data: object): Promise<string> {
    return await ejs.renderFile(file, data);
  }
}
