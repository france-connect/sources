const path = require('path');

const { Client } = require('@elastic/elasticsearch');
const ejs = require('ejs');
const { DateTime } = require('luxon');

const filesInDir = require('./helpers/find-files-in-dir');
const datamock = require('./populate-account-all-event-script');

const ELASTIC_TRACKS_INDEX = process.env.Elasticsearch_TRACKS_INDEX;
const ELASTIC_NODES = process.env.Elasticsearch_NODES;
const ELASTIC_USERNAME = process.env.Elasticsearch_USERNAME;
const ELASTIC_PASSWORD = process.env.Elasticsearch_PASSWORD;

// help to trace false logs generated in ES
const TRACE_MARK = '::mock::';

function debug(...data) {
  // eslint-disable-next-line no-console
  console.log(' * ', ...data);
}

function warn(...data) {
  // eslint-disable-next-line no-console
  console.warn(' > ', ...data);
}

function hasNoError({ errors, items }, nbOfOrders) {
  const isOk = !errors && items.length === nbOfOrders;
  if (!isOk) {
    const infos = items
      .map((item) => Object.values(item))
      .flat()
      .filter(({ error, status }) => status >= 300 && error)
      .map(({ error }) => error)
      .map(({ reason, type }) => `<${type}: ${reason}>`)
      .join(',');
    warn(`Failed when asked ${nbOfOrders} and get ${items.length} inserts`);
    warn(`Error in ES: ${infos}`);
  }
  return isOk;
}

// eslint-disable-next-line complexity
function extractDates(sequences) {
  let dates;
  try {
    // either a comma-separated string or a JSON array
    const values = /^\[.*\]$/.test(sequences)
      ? JSON.parse(sequences)
      : sequences.split(',');

    dates = values.map((value) =>
      DateTime.fromISO(value, { zone: 'utc' }).startOf('day'),
    );

    const areDates = dates.every((date) => date.isValid);
    if (!areDates) {
      throw new Error(`Invalid dates in sequences: ${sequences}`);
    }
  } catch (error) {
    throw new Error(
      `Sequences param must be a JSON array or comma-seperated dates: ${error.message}`,
    );
  }

  // Default value
  if (!dates.length) {
    dates = [DateTime.now().toUTC().startOf('day')];
  }
  return dates;
}

function parseLogs(raw) {
  const logs = raw
    .split('\n')
    .filter(Boolean)
    .map((log) => JSON.parse(log));
  return logs;
}

function buildEventsFromLogs(logs) {
  const events = logs.map((event) => ({
    ...event,
    '@version': TRACE_MARK, // traceur
  }));
  return events;
}

function datesFromLimit(month = 6) {
  const now = DateTime.now().toUTC();
  const justBeforeNow = now.minus({ day: 1 });
  const justBefore = now.minus({ month }).plus({ day: 1 });
  const justAfter = now.minus({ month }).minus({ day: 1 });
  const dates = [justBeforeNow, justBefore, justAfter].map((date) =>
    date.toISODate(),
  );

  return dates;
}

/**
 * Setup the local elasticsearch database connection.
 *
 * @see https://localhost:9200
 * @see /fc-docker/compose/fc-core.yml:152
 * - Elasticsearch_NODES
 * - Elasticsearch_USERNAME
 * - Elasticsearch_PASSWORD

 * @returns {void}
 */
function initElasticsearchClient() {
  let nodes;
  try {
    nodes = JSON.parse(ELASTIC_NODES);
  } catch (error) {
    throw new Error(`Problem with connection nodes params: ${error}`);
  }

  if (!(Array.isArray(nodes) && nodes.length)) {
    throw new Error(`Problem with connection params: ${JSON.stringify(nodes)}`);
  }

  const esClient = new Client({
    nodes,
    auth: { username: ELASTIC_USERNAME, password: ELASTIC_PASSWORD },
  });
  return esClient;
}

/**
 * Start the populate script by instantiating the class:
 * > new PopulateAccountTraces();
 *
 * The class is instantiated at the bottom of these file.
 */
class PopulateAccountTraces {
  esClient;

  async run(accountId, sequences) {
    try {
      debug('Mock requested for', accountId, ' at ', sequences);

      this.esClient = initElasticsearchClient();

      debug('Deleting old mock data in ES');
      await this.removeOldMockData();

      debug('Extract dates from request');
      const dates = extractDates(sequences);

      debug(`Generate all cinematic with ${accountId}`);
      const generatedDataMock = await this.generateMockData(accountId, dates);

      debug(`Save all mocks for ${accountId}`);
      const done = await this.save(generatedDataMock);

      /**
       * @todo #866
       * Inject all events possible for testing
       *
       * Author: Arnaud PSA
       * Date: 25/03/2022
       */
      // Use to test all events
      //const done = await this.save(datamock);

      debug('All tracks generation done');
      process.exit(done ? 0 : 1);
    } catch (error) {
      warn(error);
      process.exit(1);
    }
  }

  async removeOldMockData() {
    const query = {
      index: ELASTIC_TRACKS_INDEX,
      body: {},
      size: 1000, // over large value to delete all
      body: {
        query: {
          match: { '@version': TRACE_MARK },
        },
      },
      refresh: true,
    };
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

  async generateMockData(accountId, dates) {
    const directory = path.join(__dirname, `/tracks`);
    debug(`Grab standard cinematic to mock in directory: ${directory}`);
    const paths = filesInDir(directory, /.*mock.ejs$/);

    debug(`Prepare mock order for ${dates.join(',')}`);
    const orders = dates.map((date, index) => [
      date.toMillis(),
      paths[index % paths.length],
    ]);

    debug(`Render ${orders.length} group of mocks`);
    const jobs = orders.map(([time, mock]) =>
      ejs.renderFile(mock, { accountId, time }),
    );
    const data = await Promise.all(jobs);

    debug(`Join ${data.length} group of generated mocks`);
    const raw = data.join('\n');

    debug('Parse logs from source');
    const logs = parseLogs(raw);

    debug(`Create Mock Events from all ${logs.length} fake logs`);
    const events = buildEventsFromLogs(logs);

    return events;
  }

  /**
   * save traces in elasticsearch.
   *
   * To display database traces:
   * @see http://localhost:9200/_cat/indices/
   * @link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/examples.html
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line complexity
  async save(mocks) {
    debug(`Save only ${mocks.length} mocks in ${ELASTIC_TRACKS_INDEX}`);
    const header = { index: { _index: ELASTIC_TRACKS_INDEX } };
    const body = mocks.flatMap((doc) => [header, doc]);

    const { body: data } = await this.esClient.bulk({
      pipeline: 'geo',
      body,
      refresh: true,
    });

    return hasNoError(data, mocks.length);
  }
}

const accountId = 'test_TRACE_USER';
const sequences = JSON.stringify(datesFromLimit(6));

new PopulateAccountTraces().run(accountId, sequences);
