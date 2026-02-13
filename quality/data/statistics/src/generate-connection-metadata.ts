import * as fs from 'fs';
import path from 'path';

import { program } from 'commander';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const OUTPUT_FILE = 'connections.csv';
const NUM_CONNECTIONS = 50000;
const NUM_DAYS = 33;
const NUM_ACCOUNTS = 25;
const NUM_SP = 5;
const NUM_IDP = 5;

type Options = {
  outputFile: string;
  numConnections: number;
  numDays: number;
  numAccounts: number;
  numSp: number;
  numIdp: number;
};

program
  .option(
    '-o, --output-file <output-file>',
    'The output file to generate metadata for',
    OUTPUT_FILE,
  )
  .option(
    '-n, --num-connections <num-connections>',
    'The number of connections to generate',
    (value) => parseInt(value, 10),
    NUM_CONNECTIONS,
  )
  .option(
    '-d, --num-days <num-days>',
    'The number of days to generate metadata for',
    (value) => parseInt(value, 10),
    NUM_DAYS,
  )
  .option(
    '-a, --num-accounts <num-accounts>',
    'The number of accounts to generate metadata for',
    (value) => parseInt(value, 10),
    NUM_ACCOUNTS,
  )
  .option(
    '-s, --num-sp <num-sp>',
    'The number of service providers to generate metadata for',
    (value) => parseInt(value, 10),
    NUM_SP,
  )
  .option(
    '-i, --num-idp <num-idp>',
    'The number of identity providers to generate metadata for',
    (value) => parseInt(value, 10),
    NUM_IDP,
  );

program.parse(process.argv);

const options = program.opts<Options>();

// Define paths
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const ARTIFACTS_DIR = path.join(dirname, '../artifacts');
const OUTPUT_FILE_PATH = path.join(ARTIFACTS_DIR, options.outputFile);

// Generate a random integer between 0 and max (inclusive)
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

// Prepare the lists of service providers and identity providers
const serviceProviders: string[] = [];
const identityProviders: string[] = [];

for (let i = 1; i <= options.numSp; i++) {
  serviceProviders.push(`sp-public${i}`, `sp-private${i}`);
}

for (let i = 1; i <= options.numIdp; i++) {
  identityProviders.push(`idp-public${i}`, `idp-private${i}`);
}

// Generate a pool of UUID v4 account IDs
const accountIds: string[] = Array.from({ length: options.numAccounts }, () =>
  uuidv4(),
);

// Generate and sort NUM_CONNECTIONS random time offsets over NUM_DAYS
const DAY_MS = 24 * 60 * 60 * 1000; // ms in a day
const MAX_OFFSET = options.numDays * DAY_MS; // max offset in ms
const connectionOffset: number[] = Array.from(
  { length: options.numConnections },
  () => getRandomInt(MAX_OFFSET),
).sort((a, b) => a - b);

// Compose each CSV line: offset, service provider, identity provider, accountId
const lines: string[] = connectionOffset.map((offset) => {
  const sp = serviceProviders[getRandomInt(serviceProviders.length - 1)];
  const idp = identityProviders[getRandomInt(identityProviders.length - 1)];
  const acct = accountIds[getRandomInt(accountIds.length - 1)];
  return `${offset},${sp},${idp},${acct}`;
});

// Write the CSV file
fs.writeFileSync(OUTPUT_FILE_PATH, lines.join('\n'), 'utf-8');

// eslint-disable-next-line no-console
console.log(
  `✅ ${options.numConnections} connections generated in "${OUTPUT_FILE_PATH}"`,
);
