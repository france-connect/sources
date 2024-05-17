/* istanbul ignore file */

// Declarative code

/**
 * Re export Nestjs built in HttpException
 * to make it easier to import exceptions in other modules
 * ie: we always import error interfaces from @fc/error
 */
export * from './fc.exception';
export { ValidationException } from './validation.exception';
export { HttpException } from '@nestjs/common';
export { RpcException } from '@nestjs/microservices';
