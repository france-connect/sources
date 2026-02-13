import * as fs from 'fs';
import path from 'path';

import { program } from 'commander';
import { DateTime } from 'luxon';
import * as readline from 'readline';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const INPUT_FILE = 'connections.csv';
const OUTPUT_FILE = 'connections.log';
const START_DAY = '31/07/2025';
const ACR = 'eidas2';
const HOSTNAME = 'core-fcp-01';
const CATEGORY = 'FRONT_CINEMATIC';
const EVENT = 'FC_VERIFIED';
const STEP = '5.0.0';

// Define paths
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const ARTIFACTS_DIR = path.join(dirname, '../artifacts');
const INPUT_FILE_PATH = path.join(ARTIFACTS_DIR, INPUT_FILE);
const OUTPUT_FILE_PATH = path.join(ARTIFACTS_DIR, OUTPUT_FILE);

type Options = {
  event: string;
  startDay: string;
  acr: string;
  hostname: string;
  category: string;
  inputFile: string;
  outputFile: string;
};

program
  .option('-e, --event <event>', 'The event to generate logs for', EVENT)
  .option(
    '-s, --start-day <start-day>',
    'The start day to generate logs for',
    START_DAY,
  )
  .option('-a, --acr <acr>', 'The ACR to generate logs for', ACR)
  .option(
    '-h, --hostname <hostname>',
    'The hostname to generate logs for',
    HOSTNAME,
  )
  .option(
    '-c, --category <category>',
    'The category to generate logs for',
    CATEGORY,
  )
  .option(
    '-i, --input-file <input-file>',
    'The input file to generate logs for',
    INPUT_FILE_PATH,
  )
  .option(
    '-o, --output-file <output-file>',
    'The output file to generate logs for',
    OUTPUT_FILE_PATH,
  );

program.parse(process.argv);

const options = program.opts<Options>();

/**
 * Returns the timestamp (ms since epoch) for midnight
 * on the day (formatted 'dd/MM/yyyy') in Europe/Paris timezone.
 */
function getTimestamp(day: string): number {
  const startDay = DateTime.fromFormat(day, 'dd/MM/yyyy', {
    zone: 'Europe/Paris',
  });
  if (!startDay.isValid) {
    throw new Error(`Invalid START_DAY format: ${day}`);
  }
  return startDay.startOf('day').toMillis();
}

async function main(options: Options) {
  const startTimestamp = getTimestamp(options.startDay);

  // Open a write stream in append mode
  const logStream = fs.createWriteStream(options.outputFile, { flags: 'a' });
  logStream.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('Error writing to log file:', err);
    process.exit(1);
  });

  const rl = readline.createInterface({
    crlfDelay: Infinity,
    input: fs.createReadStream(options.inputFile),
  });

  const { createHash, randomBytes } = await import('node:crypto');

  for await (const line of rl) {
    if (!line.trim()) continue; // skip empty lines

    // Parse CSV: offset(ms), spId, idpId, accountId
    const [offsetStr, spId, idpId, accountId] = line.split(',');
    const offset = Number(offsetStr);
    const timestamp = startTimestamp + offset;

    // Random network source
    const sourceAddress = randomIp();
    const sourcePort = randomPort();

    // Random identifiers
    const sessionId = randomBytes(64).toString('hex'); // 128 hex chars
    const interactionId = randomBytes(16).toString('hex').slice(0, 21);
    const browsingSessionId = uuidv4();
    const logId = uuidv4();

    // Determine public/private
    const spType = spId.includes('public') ? 'public' : 'private';

    // Derive subs with SHA-256
    const spSub =
      createHash('sha256')
        .update(accountId + spId)
        .digest('hex') + 'v1';
    const idpSub = createHash('sha256')
      .update(accountId + idpId)
      .digest('hex');

    // Build the log object
    const logEntry = {
      accountId,
      browsingSessionId,
      category: options.category,
      deviceIsSuspicious: false,
      deviceTrusted: false,
      event: options.event,
      hostname: options.hostname,
      idpAcr: options.acr,
      idpId,
      idpLabel: `${idpId}-label`,
      idpName: `${idpId}-name`,
      idpSub,
      interactionAcr: options.acr,
      interactionId,
      ip: sourceAddress,
      isSso: false,
      level: 'info',
      logId,
      pid: process.pid,
      sessionId,
      source: {
        address: sourceAddress,
        original_addresses: sourceAddress,
        port: sourcePort,
      },
      spAcr: options.acr,
      spId,
      spName: `${spId}-name`,
      spSub,
      spType,
      step: STEP,
      time: timestamp,
    };

    // Write one JSON object per line
    logStream.write(JSON.stringify(logEntry) + '\n');
  }

  // Close the stream when done
  logStream.end(() => {
    // eslint-disable-next-line no-console
    console.log(`✅ All entries written to "${options.outputFile}"`);
  });
}

function randomIp(): string {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(
    '.',
  );
}

function randomPort(): string {
  return String(Math.floor(Math.random() * (65535 - 1024) + 1024));
}

main(options).catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error processing CSV:', err);
  process.exit(1);
});
