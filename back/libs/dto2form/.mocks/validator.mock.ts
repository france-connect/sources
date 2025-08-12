import {
  FieldValidator,
  MessageLevelEnum,
  MessagePriorityEnum,
} from '@fc/dto2form';

export function getValidatorMock(name: string): FieldValidator {
  return {
    name,
    errorMessage: {
      content: `${name}_error_label`,
      level: MessageLevelEnum.ERROR,
      priority: MessagePriorityEnum.ERROR,
    },
    validationArgs: [`${name}_validation_arg_1`, `${name}_validation_arg_2`],
  };
}
