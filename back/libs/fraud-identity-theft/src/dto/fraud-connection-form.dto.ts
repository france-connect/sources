import {
  $IsNotEmpty,
  $IsUUID,
  Form,
  FormDtoBase,
  Input,
  MessageLevelEnum,
  MessagePriorityEnum,
} from '@fc/dto2form';

@Form()
export class FraudConnectionFormDto extends FormDtoBase {
  @Input({
    required: true,
    order: 1,
    messages: [
      {
        level: MessageLevelEnum.WARNING,
        priority: MessagePriorityEnum.WARNING,
        /**
         * @todo #2346 Remplacer les chaînes de caractère par des clés de traduction
         * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2346
         */
        content:
          'Chaque connexion est associée à un code d’identification différent. Vérifiez si le code indiqué correspond bien à la connexion frauduleuse que vous souhaitez signalée',
      },
    ],
    validators: [$IsNotEmpty(), $IsUUID()],
  })
  code: string;
}
