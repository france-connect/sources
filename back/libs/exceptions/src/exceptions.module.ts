/* istanbul ignore file */

// Declarative file
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  exports: [CqrsModule],
})
export class ExceptionsModule {}
