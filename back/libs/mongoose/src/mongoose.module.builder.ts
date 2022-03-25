import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { MongooseConfig } from './dto';
// Import the module into itself for test purpose
import * as helper from './mongoose.module.builder';

export function connectionFactory(
  logger: LoggerService,
  uri: string,
  connection: { $initialConnection: Promise<unknown> },
): { $initialConnection: Promise<unknown> } {
  /**
   * @todo improve error handler if mongodb connection failed
   * when it failed, it was generating a UnhandledException
   * after 30 sec of the app's start!
   *
   * Author: Arnaud PSA
   * Date: 18/01/2022
   */
  connection.$initialConnection = connection.$initialConnection.catch(
    (error) => {
      logger.error(`Invalid Mongodb Connection for ${uri}`);
      logger.error(JSON.stringify(error, null, 2));
      logger.error('Exiting app');
      process.exit(1);
    },
  );

  return connection;
}

export function buildFactoryParams(
  logger: LoggerService,
  { user, password, hosts, database, options }: MongooseConfig,
): MongooseModuleOptions {
  logger.debug('buildFactoryParams()');

  const uri = `mongodb://${user}:${password}@${hosts}/${database}`;

  const params: MongooseModuleOptions = {
    uri,
    ...options,
    connectionFactory: helper.connectionFactory.bind(this, logger, uri),
  };

  logger.trace({ params });

  return params;
}

export function mongooseModuleBuilder(configName = 'Mongoose') {
  const mongoose = MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [LoggerService, ConfigService],
    useFactory: (logger: LoggerService, config: ConfigService) =>
      helper.buildFactoryParams(logger, config.get<MongooseConfig>(configName)),
  });
  return mongoose;
}
