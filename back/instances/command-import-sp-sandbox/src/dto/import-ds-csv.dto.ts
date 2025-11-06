import { Transform } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class ImportDsCsvDto {
  @IsEmail()
  readonly email: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  readonly datapassId: number;
}
