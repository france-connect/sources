import { Genders } from '../enums';

export const GenderToRnippGender = {
  [Genders.FEMALE]: 'F',
  [Genders.MALE]: 'M',
  [Genders.UNSPECIFIED]: 'I',
};

export function getGenderFromRnippGender(value: string): string {
  const [gender = ''] =
    Object.entries(GenderToRnippGender).find(
      ([_, rnippGender]) => rnippGender === value,
    ) || [];
  return gender;
}

export function getRnippGenderFromGender(gender: string): string {
  const rnippGender = GenderToRnippGender[gender] || '';
  return rnippGender;
}
