import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Options for NestJs's RabbitMQ module
 * @see https://docs.nestjs.com/microservices/rabbitmq#options
 */
export class RabbitmqConfig {
  @IsArray()
  // @IsUrl()
  readonly urls: string[];

  @IsString()
  readonly queue: string;

  /**
   * @TODO #147 Validate options (hard coded)
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/147
   */
  @IsOptional()
  readonly queueOptions?: object;

  /**
   * @TODO #147 Configure others available options
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/147
   * @see https://docs.nestjs.com/microservices/rabbitmq#options
   * @IsNumber()
   * @Type(() => Number)
   *  prefetchCount: number;
   *
   *  @IsBoolean()
   *  readonly noAck: boolean;
   *
   *  @ValidateNested()
   *  @Type(() => SocketOptions)
   *  readonly socketOptions: object;
   */

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
