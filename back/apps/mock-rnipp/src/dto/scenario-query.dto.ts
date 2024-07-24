import { IsString, Length, Matches } from 'class-validator';

const NUMBER_REGEX = /^\d+$/;

export class ScenarioQueryDto {
  @IsString()
  codeLieuNaissance: string;

  @IsString()
  prenoms: string;

  @IsString()
  @Length(8, 8, {
    message: 'Date of birth must be exactly 8 characters long.',
  })
  @Matches(NUMBER_REGEX, {
    message: 'Date of birth must contain only numbers.',
  })
  dateNaissance: string;
}
