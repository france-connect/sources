/* istanbul ignore file */

// Declarative code
interface IdpNewStateInterface {
  uid: string;
  name: string;
  title: string;
  allowed: boolean;
}

export interface IdpSettingsChangesInterface {
  futureAllowedNewValue?: boolean;
  list: IdpNewStateInterface[];
}
