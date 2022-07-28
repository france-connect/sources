import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { MongooseConfig } from '../dto';
import { NestJsConnection } from '../interfaces';

@Injectable()
export class MongooseProvider {
  static connectionFactory(
    logger: LoggerService,
    uri: string,
    connectionName: string,
    connection: NestJsConnection,
  ): NestJsConnection {
    logger.debug('connecting...');

    // too simple to be extracted in a testable function
    /* istanbul ignore next line */
    connection.on('connected', () =>
      logger.debug(`Connection ${connectionName} connected`),
    );
    // too simple to be extracted in a testable function
    /* istanbul ignore next line */
    connection.on('disconnected', () =>
      logger.debug(`Connection ${connectionName} disconnected`),
    );
    // too simple to be extracted in a testable function
    /* istanbul ignore next line */
    connection.on('reconnect', () =>
      logger.debug(`Connection ${connectionName} reconnected`),
    );

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

  static buildMongoParams(
    logger: LoggerService,
    config: ConfigService,
    connectionName: string,
  ): MongooseModuleOptions {
    const { user, password, hosts, database, options } =
      config.get<MongooseConfig>(connectionName);

    const uri = `mongodb://${user}:${password}@${hosts}/${database}`;

    const params: MongooseModuleOptions = {
      uri,
      ...options,
      connectionFactory: MongooseProvider.connectionFactory.bind(
        this,
        logger,
        uri,
        connectionName,
      ),
    };

    logger.trace({ connectionName, params });

    return params;
  }
}
