import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { MongooseConfig } from '../dto';
import {
  MongooseConnectionConnectedEvent,
  MongooseConnectionDisconnectedEvent,
  MongooseConnectionReconnectedEvent,
} from '../events';
import { NestJsConnection } from '../interfaces';

@Injectable()
export class MongooseProvider {
  static connectionFactory(
    logger: LoggerService,
    connectionName: string,
    eventBus,
    connection: NestJsConnection,
  ): NestJsConnection {
    eventBus.publish(new MongooseConnectionReconnectedEvent());
    logger.debug(`Connection ${connectionName}`);

    // too simple to be extracted in a testable function
    /* istanbul ignore next line */
    connection.on('connected', () =>
      eventBus.publish(new MongooseConnectionConnectedEvent()),
    );
    // too simple to be extracted in a testable function
    /* istanbul ignore next line */
    connection.on('disconnected', () =>
      eventBus.publish(new MongooseConnectionDisconnectedEvent()),
    );
    // too simple to be extracted in a testable function
    /* istanbul ignore next line */
    connection.on('reconnected', () =>
      eventBus.publish(new MongooseConnectionReconnectedEvent()),
    );

    connection.$initialConnection = connection.$initialConnection.catch(
      (error) => {
        logger.error(`Invalid Mongodb Connection for ${connectionName}`);
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
    eventBus,
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
        connectionName,
        eventBus,
      ),
    };

    logger.trace({ connectionName });

    return params;
  }
}
