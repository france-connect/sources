import * as amqp from 'amqplib';

import { type RmqMessage } from '../support/types';

const BROKER_HOST = 'broker';
const BROKER_URL = `amqp://${BROKER_HOST}:5672`;

async function initRmqConnection(): Promise<amqp.ChannelModel> {
  const connection = await amqp.connect(BROKER_URL);
  connection.on('error', (error) => {
    // Display the error in the cypress console
    // eslint-disable-next-line no-console
    console.error('RabbitMQ connection error:', error);
  });
  return connection;
}

interface RmqSendMessageArgs {
  queue: string;
  message: string;
}

export async function rmqSendMessage(
  args: RmqSendMessageArgs,
): Promise<boolean> {
  const { message, queue } = args;

  let result: boolean = false;
  let connection: amqp.ChannelModel | null = null;
  let channel: amqp.Channel | null = null;

  try {
    connection = await initRmqConnection();
    channel = await connection.createChannel();

    await channel.checkQueue(queue);

    result = channel.sendToQueue(queue, Buffer.from(message));
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Display the error in the cypress console
      // eslint-disable-next-line no-console
      console.log({ message: error.message });
    }
  } finally {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
  }
  return result;
}

interface RmqGetMessageArgs {
  queue: string;
}

export async function rmqGetMessage(
  args: RmqGetMessageArgs,
): Promise<RmqMessage | null> {
  const { queue } = args;

  let data = null;
  let connection: amqp.ChannelModel | null = null;
  let channel: amqp.Channel | null = null;

  try {
    connection = await initRmqConnection();
    channel = await connection.createChannel();

    await channel.checkQueue(queue);

    const message = await channel.get(queue, { noAck: true });
    if (message && message.content) {
      const { content } = message;
      const contentObject = JSON.parse(content.toString());
      data = contentObject.data;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Display the error in the cypress console
      // eslint-disable-next-line no-console
      console.log({ message: error.message });
    }
  } finally {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
  }
  return data;
}

export async function rmqInitQueue(queue: string): Promise<boolean> {
  let connection: amqp.ChannelModel | null = null;
  let channel: amqp.Channel | null = null;
  let result: amqp.Replies.PurgeQueue = {} as amqp.Replies.PurgeQueue;

  try {
    connection = await initRmqConnection();
    channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      arguments: { 'x-message-ttl': 5000 },
      durable: true,
    });

    result = await channel.purgeQueue(queue);
  } catch (error: unknown) {
    // Display the error in the cypress console
    // eslint-disable-next-line no-console
    console.log({ message: error instanceof Error ? error.message : error });
  } finally {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
  }

  return Object.prototype.hasOwnProperty.call(result, 'messageCount');
}
