import type { ButtonTypes, Priorities } from '@fc/dsfr';

export interface FormActionsInterface {
  // @NOTE label should be a translation key
  // not the translated string itself.
  // e.g. 'Form.submit'
  label: string;
  type: ButtonTypes;
  priority?: Priorities;
  onClick?: () => void;
  disabled?: boolean | (({ canSubmit }: { canSubmit: boolean }) => boolean);
}
