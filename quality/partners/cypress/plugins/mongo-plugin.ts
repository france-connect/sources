import { MongoClient } from 'mongodb';

const sslVolumesPath = `${process.env.FC_ROOT}/fc/docker/volumes/ssl`;
const mongoOptions = {
  replicaSet: 'rs0',
  tls: true,
  tlsCAFile: `${sslVolumesPath}/docker-stack-ca.crt`,
  tlsCertificateKeyFile: `${sslVolumesPath}/app.pem`,
};

const MONGO_HOST = process.env.CI ? 'mongo-fcp-low' : 'localhost';
const getMongoConfig = () => ({
  collection: 'client',
  database: 'core-fcp-low',
  options: mongoOptions,
  uri: `mongodb://core-fcp-low:pass@${MONGO_HOST}:27017/core-fcp-low`,
});

interface MongoFindOneArgs {
  collection?: string;
  database?: string;
  query: unknown;
}

export async function mongoFindOne(
  args: MongoFindOneArgs,
): Promise<unknown | null> {
  const config = getMongoConfig();

  const uri = config.uri;
  const mongoClientOptions = config.options;
  const database = args.database || config.database;
  const collection = args.collection || config.collection;

  const client = new MongoClient(uri, mongoClientOptions);
  let result = null;
  try {
    await client.connect();
    result = await client
      .db(database)
      .collection(collection)
      .findOne(args.query);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  return result;
}

interface MongoDeleteOneArgs {
  collection?: string;
  database?: string;
  query: unknown;
}

export async function mongoDeleteOne(
  args: MongoDeleteOneArgs,
): Promise<unknown | null> {
  const config = getMongoConfig();

  const uri = config.uri;
  const mongoClientOptions = config.options;
  const database = args.database || config.database;
  const collection = args.collection || config.collection;

  const client = new MongoClient(uri, mongoClientOptions);
  let result = null;
  try {
    await client.connect();
    result = await client
      .db(database)
      .collection(collection)
      .deleteOne(args.query);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  return result;
}
