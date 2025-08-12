import {
  $IsNotEmpty,
  Form,
  FormDtoBase,
  Input,
  MessageLevelEnum,
  MessagePriorityEnum,
} from '@fc/dto2form';

@Form()
export class FraudIdentityFormDto extends FormDtoBase {
  @Input({
    required: true,
    order: 1,
    messages: [
      {
        level: MessageLevelEnum.INFO,
        priority: MessagePriorityEnum.INFO,
        /**
         * @todo #2346 Remplacer les chaînes de caractère par des clés de traduction
         * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2346
         */
        content:
          'Attention à ne pas renseigner le nom marital (nom de mariage). Seul le nom de naissance est pris en compte.',
      },
    ],
    validators: [$IsNotEmpty()],
  })
  family_name: string;

  @Input({
    required: true,
    order: 2,
    validators: [$IsNotEmpty()],
  })
  given_name: string;

  @Input({
    required: true,
    order: 3,
    validators: [$IsNotEmpty()],
  })
  rawBirthdate: string;

  @Input({
    required: true,
    order: 4,
    messages: [
      {
        level: MessageLevelEnum.INFO,
        priority: MessagePriorityEnum.INFO,
        /**
         * @todo #2346 Remplacer les chaînes de caractère par des clés de traduction
         * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2346
         */
        content:
          'Faire attention à bien renseigner le pays de naissance se trouvant sur l’acte de naissance',
      },
    ],
    validators: [$IsNotEmpty()],
  })
  rawBirthcountry: string;

  @Input({
    required: true,
    order: 5,
    messages: [
      {
        level: MessageLevelEnum.INFO,
        priority: MessagePriorityEnum.INFO,
        /**
         * @todo #2346 Remplacer les chaînes de caractère par des clés de traduction
         * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2346
         */
        content:
          'Faire attention à bien renseigner le lieu de naissance se trouvant sur l’acte de naissance',
      },
    ],
    validators: [$IsNotEmpty()],
  })
  rawBirthplace: string;
}
