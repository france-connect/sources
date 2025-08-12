import { $IsEmail, $IsNotEmpty, Form, FormDtoBase, Input } from '@fc/dto2form';

@Form()
export class FraudContactFormDto extends FormDtoBase {
  @Input({
    type: 'email',
    required: true,
    order: 1,
    validators: [$IsNotEmpty(), $IsEmail()],
  })
  email: string;

  @Input({
    type: 'text',
    order: 2,
    validators: [$IsNotEmpty()],
  })
  phone?: string;
}
