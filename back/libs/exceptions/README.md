# Librairie d'erreur

## Dossier _Decorator_

### Loggable

Ce décorateur permet de **loguer** les erreurs techniques qui nécessite une investigation de la part des développeurs.
Il suffit de rajouter ce décorateur pour **loguer** l'exception. La valeur par défaut est _true_, on retourne _false_ si décorateur non instancié.

### Trackable

Ce décorateur permet de **tracker** tous les évènements dit **business** ne nécessitant pas d'action de notre part mais important juridiquement.
Il suffit de rajouter ce décorateur pour **tracker** l'exception. La valeur par défaut est _true_, on retourne _false_ si décorateur non instancié
