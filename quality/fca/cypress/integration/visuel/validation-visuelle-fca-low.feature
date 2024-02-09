      #language: fr
      @validationVisuelle
      Fonctionnalité: Validation Visuelle

      Plan du Scénario: Validation Visuelle - cinématique d'un agent sur <device>
      Etant donné que j'utilise un navigateur web sur "<device>"
      Et que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes"
      Et que je navigue sur la page fournisseur de service
      Et que je clique sur le bouton AgentConnect
      Et que je suis redirigé vers la page interaction
      Et que la copie d'écran "selectionFI" correspond à la page actuelle sur "<device>"
      Et que j'utilise un fournisseur d'identité "actif"
      Et que j'entre l'email "test@fia1.fr"
      Et que je clique sur le bouton de connexion
      Et que je suis redirigé vers la page login du fournisseur d'identité
      Quand je m'authentifie avec succès
      Alors je suis redirigé vers la page fournisseur de service
      Et je suis connecté au fournisseur de service
      Et le fournisseur de service a accès aux informations des scopes "tous les scopes"

      Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

      Plan du Scénario: Validation Visuelle - erreur ACR inconnu envoyé par le FI sur <device>
      Etant donné que j'utilise un navigateur web sur "<device>"
      Et que j'utilise le fournisseur de service "par défaut"
      Et que j'utilise le fournisseur d'identité "par défaut"
      Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
      Et que je navigue sur la page fournisseur de service
      Et que je clique sur le bouton AgentConnect
      Et que je suis redirigé vers la page interaction
      Et que j'utilise un fournisseur d'identité "actif"
      Et que j'entre l'email "test@fia1.fr"
      Et que je clique sur le bouton de connexion
      Et que je suis redirigé vers la page login du fournisseur d'identité
      Et que le fournisseur d'identité garantit un niveau de sécurité "inconnu"
      Quand je m'authentifie avec succès
      Alors je suis redirigé vers la page erreur technique
      Et la copie d'écran "erreur" correspond à la page actuelle sur "<device>"
      Et le code d'erreur est "Y020001"
      # todo: before merging redesign fca feature branch, add a more specific error(s) like previous version "Le niveau de sécurité utilisé pour vous authentifier ne correspondant pas au niveau exigé pour votre démarche."
      Et le message d'erreur est "Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter."

      Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
