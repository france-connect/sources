import { $IsString, Form, FormDtoBase, Input } from '@fc/dto2form';

@Form()
export class FraudDescriptionFormDto extends FormDtoBase {
  @Input({
    type: 'textarea',
    required: true,
    order: 1,
    validators: [$IsString()],
  })
  description: string;
}
