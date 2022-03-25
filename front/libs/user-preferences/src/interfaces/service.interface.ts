/* istanbul ignore file */

// declarative file
export interface Service {
  uid: string;
  title: string;
  image: string | undefined;
  active: boolean;
  // @NOTE attention la propriete name correspond a une ID arbitraire
  // il ne faut l'utiliser comme identifiant unique
  // du fait qu'elle est libre de saisie à l'user
  name: string;
  isChecked: boolean;
}
