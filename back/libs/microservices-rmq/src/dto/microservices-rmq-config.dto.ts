import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

import { IsBufferEncoding } from '@fc/common';

import { BufferEncodingEnum } from '../enums';

/**
 * Options for NestJs's RabbitMQ module
 * @see https://docs.nestjs.com/microservices/rabbitmq#options
 */
export class MicroservicesRmqConfig {
  // class-validator built-in options
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @IsUrl({ protocols: ['amqp', 'amqps'], require_tld: false }, { each: true })
  readonly urls: string[];

  @IsString()
  readonly queue: string;

  @IsOptional()
  readonly queueOptions?: object;

  @IsBufferEncoding()
  readonly payloadEncoding: BufferEncodingEnum;

  @IsNumber()
  readonly requestTimeout: number;
}
