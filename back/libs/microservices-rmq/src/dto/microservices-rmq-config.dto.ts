import { IsIn, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

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

  /**
   * Custom properties
   */
  @IsIn([
    'ascii',
    'utf8',
    'utf-8',
    'utf16le',
    'ucs2',
    'ucs-2',
    'base64',
    'latin1',
    'binary',
    'hex',
  ])
  @IsString()
  readonly payloadEncoding: BufferEncoding;

  @IsNumber()
  readonly requestTimeout: number;
}
