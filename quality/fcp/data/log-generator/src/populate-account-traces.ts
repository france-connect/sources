import { DateTime } from 'luxon';

import { ElasticSearchConfig } from './config';
import {
  DefaultMockDataPaths,
  Methods,
  Platforms,
  ServicePlatformMapping,
} from './enums';
import {
  debug,
  ESHelper,
  extractDates,
  extractPaths,
  generateMockData,
  getDatesFromLimit,
  injectMockData,
  warn,
} from './helpers';

/**
 *
 * The class is instantiated at the bottom of these file.
 *
 */
export class PopulateAccountTraces {
  esHelper;

  constructor() {
    this.esHelper = new ESHelper(
      ElasticSearchConfig.nodes,
      ElasticSearchConfig.username,
      ElasticSearchConfig.password,
    );
  }

  async run([method, platform, id, arg1, arg2]: [
    string?,
    string?,
    string?,
    string?,
    string?,
  ]): Promise<void> {
    const availableMethods = Object.values<string>(Methods);
    if (!availableMethods.includes(method)) {
      warn(`Please provide a method : ${availableMethods.join(' / ')}`);
      return;
    }

    const availablePlatforms = Object.values<string>(Platforms);
    if (!availablePlatforms.includes(platform)) {
      warn(`Please provide a platform : ${availablePlatforms.join(' / ')}`);
      return;
    }

    const accountId = id || 'test_TRACE_USER';
    const esIndex =
      platform === Platforms.LEGACY
        ? ElasticSearchConfig.legacyIndex
        : ElasticSearchConfig.coreV2Index;

    if (method === Methods.REMOVE) {
      await this.remove(platform);
      return;
    }

    if (method === Methods.GENERATE) {
      const mockDataPaths = arg1
        ? extractPaths(arg1, platform)
        : DefaultMockDataPaths[platform];
      const mockDates = arg2 ? extractDates(arg2) : getDatesFromLimit(6);
      await this.generate(accountId, mockDataPaths, mockDates, esIndex);
      return;
    }

    if (method === Methods.INJECT) {
      if (!arg1) {
        warn(
          'Please provide the log file name from folder /docker/volumes/log/ to inject',
        );
        return;
      }
      const logFile = arg1;
      const service = ServicePlatformMapping[platform];
      await this.inject(logFile, esIndex, service);
      return;
    }
  }

  async generate(
    accountId: string,
    mockDataPaths: string[],
    dates: DateTime[],
    esIndex: string,
  ): Promise<void> {
    try {
      debug(
        `Mock requested for ${accountId} with ${JSON.stringify(mockDataPaths)} at ${JSON.stringify(dates)}`,
      );

      debug(`Generate all cinematic with ${accountId}`);
      const generatedDataMock = await generateMockData(
        accountId,
        mockDataPaths,
        dates,
      );

      debug(`Save all mocks for ${accountId}`);
      const done = await this.esHelper.save(generatedDataMock, esIndex);

      debug('All tracks generation done');
      process.exit(done ? 0 : 1);
    } catch (error) {
      if (error instanceof Error) {
        warn(error.message);
      }
      process.exit(1);
    }
  }

  async remove(platform: string): Promise<void> {
    let query;

    try {
      debug(`Deleting old mock data in ES for ${platform} platform`);

      const multiIndex = [
        ElasticSearchConfig.legacyIndex,
        ElasticSearchConfig.coreV2Index,
      ];
      switch (platform) {
        case Platforms.LEGACY:
          query = this.esHelper.buildQuery(ElasticSearchConfig.legacyIndex);
          break;
        case Platforms.LOW:
        case Platforms.HIGH:
          query = this.esHelper.buildQuery(ElasticSearchConfig.coreV2Index);
          break;
        default:
          query = this.esHelper.buildQuery(multiIndex);
          break;
      }

      await this.esHelper.deleteByQuery(query);

      debug('Mock data removed');
      process.exit(0);
    } catch (error) {
      if (error instanceof Error) {
        warn(error.message);
      }
      process.exit(1);
    }
  }

  async inject(
    pathEventLog: string,
    esIndex: string,
    service?: string,
  ): Promise<void> {
    try {
      debug('Parse logs from source');
      const logs = await injectMockData(pathEventLog, service);

      debug(`Inject ${logs.length} events in ES`);
      const done = await this.esHelper.save(logs, esIndex);

      process.exit(done ? 0 : 1);
    } catch (error) {
      if (error instanceof Error) {
        warn(error.message);
      }
      process.exit(1);
    }
  }
}

const args = process.argv.slice(2) as [
  string?,
  string?,
  string?,
  string?,
  string?,
];
const instance = new PopulateAccountTraces();

void instance.run(args);
