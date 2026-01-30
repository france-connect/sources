import { IsNumber, IsPositive } from 'class-validator';

export class MongooseChangeStreamConfig {
  @IsNumber()
  @IsPositive()
  readonly debounceDelayMs: number;
}
