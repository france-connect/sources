import { Expose } from 'class-transformer';

import { $IsEmail, Form, FormDtoBase, Input } from '@fc/dto2form';

@Form()
export class AddContributorInputDto extends FormDtoBase {
  @Input({
    required: true,
    order: 1,
    validators: [$IsEmail()],
  })
  @Expose()
  readonly email: string;
}
