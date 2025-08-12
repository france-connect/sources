import { $IsNotEmpty, Form, FormDtoBase, Input } from '@fc/dto2form';

@Form()
export class FraudSummaryFormDto extends FormDtoBase {
  @Input({
    required: true,
    type: 'consent',
    order: 1,
    validators: [$IsNotEmpty()],
  })
  consent: boolean;
}
