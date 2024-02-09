import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

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
    eventBus,
    connection: NestJsConnection,
  ): NestJsConnection {
    eventBus.publish(new MongooseConnectionReconnectedEvent());
    logger.debug(`Connection`);

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
        logger.emerg(error, 'Invalid Mongodb Connection, exiting app');
        process.exit(1);
      },
    );

    return connection;
  }

  static buildMongoParams(
    logger: LoggerService,
    config: ConfigService,
    eventBus,
  ): MongooseModuleOptions {
    const { user, password, hosts, database, options } =
      config.get<MongooseConfig>('Mongoose');

    const uri = `mongodb://${user}:${password}@${hosts}/${database}`;
    const params: MongooseModuleOptions = {
      uri,
      ...options,
      connectionFactory: MongooseProvider.connectionFactory.bind(
        this,
        logger,
        eventBus,
      ),
    };

    return params;
  }
}
