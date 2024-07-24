import { Client } from '@elastic/elasticsearch';

import { HelpTracerFalseLogs } from '../enums';
import { BuildEventLogs, EsQueryInterface, LogsInterface } from '../interfaces';
import { hasNoError } from './has-no-error';
import { debug } from './log';
import { safelyParseJson } from './safely-parse-json';

export class ESHelper {
  esClient: Client;

  constructor(esNodes: string, username: string, password: string) {
    let nodes;
    try {
      nodes = safelyParseJson(esNodes);
    } catch (error) {
      throw new Error(`Problem with connection nodes params: ${error}`);
    }

    if (!(Array.isArray(nodes) && nodes.length)) {
      throw new Error(
        `Problem with connection params: ${JSON.stringify(nodes)}`,
      );
    }

    this.esClient = new Client({
      auth: { password, username },
      nodes,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  buildQuery(index: string | string[]): EsQueryInterface {
    // over large value to delete all
    return {
      body: {
        query: {
          match: { '@version': HelpTracerFalseLogs.TRACE_MARK },
        },
      },
      index,
      refresh: true,
      size: 2000,
    };
  }

  async save(logs: LogsInterface[], index: string): Promise<boolean> {
    const header = {
      index: { _index: index, _type: '_doc' },
    };
    const body = logs.flatMap((doc) => [header, doc]);

    const { body: data } = await this.esClient.bulk({
      body,
      pipeline: 'geo',
      refresh: true,
    });

    return hasNoError(data, logs.length);
  }

  async deleteByQuery(query: EsQueryInterface): Promise<void> {
    const {
      body: { deleted, failures },
    } = await this.esClient.deleteByQuery(query);

    debug(`${deleted} document(s) were deleting...`);

    if (failures.length) {
      throw new Error(
        `Deleting old mocks failed, still have ${failures.length} docs`,
      );
    }
  }

  async createDocument({
    accountId,
    data,
    dates,
    esIndex,
    event,
    typeAction,
  }: BuildEventLogs): Promise<boolean> {
    let docs: LogsInterface[];

    if (event && typeAction) {
      docs = dates.map((date) => ({
        ...data,
        accountId,
        action: event,
        time: date.toISO(),
        type_action: typeAction,
      }));
    } else {
      docs = dates.map((date) => ({
        ...data,
        accountId,
        event,
        time: date.toMillis(),
      }));
    }

    const done = await this.save(docs, esIndex);

    return done;
  }
}
