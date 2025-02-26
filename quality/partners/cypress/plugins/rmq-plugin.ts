import client, { Channel, Connection } from 'amqplib';

import { type RmqMessage } from '../support/types';

const BROKER_HOST = process.env.CI ? 'broker' : 'localhost';
const BROKER_URL = `amqp://${BROKER_HOST}:5672`;

interface RmqSendMessageArgs {
  queue: string;
  message: string;
}

export async function rmqSendMessage(
  args: RmqSendMessageArgs,
): Promise<boolean> {
  const { message, queue } = args;

  let result: boolean = false;
  let connection: Connection;
  let channel: Channel;
  try {
    connection = await client.connect(BROKER_URL);

    // Retrieve existing channel
    channel = await connection.createChannel();
    await channel.checkQueue(queue);

    // Send a message to the queue
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
    await connection.close();
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
  let connection: Connection;
  let channel: Channel;
  try {
    connection = await client.connect(BROKER_URL);

    // Retrieve existing channel
    channel = await connection.createChannel();
    await channel.checkQueue(queue);

    // Get a message from the queue
    const message = await channel.get(queue, { noAck: true });
    if (message && message.content) {
      const { content } = message;
      const contentObject = JSON.parse(content.toString());
      // Retrieve only the data part of the RMQ message
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
    await connection.close();
  }
  return data;
}
