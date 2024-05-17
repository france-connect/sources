import { FcException } from '@fc/exceptions';

export class CoreFcaBaseException extends FcException {
  public readonly scope = 50;

  public title = 'Accès impossible';
  public description =
    "Nous n'arrivons pas à vous connecter à votre service en ligne pour l'instant. Votre adresse e-mail n'est pas autorisée par ce service en ligne.";
  public illustration = 'default-error';

  public displayContact = true;
  public contactMessage =
    'Vous pouvez nous signaler cette erreur en nous écrivant.';
}
