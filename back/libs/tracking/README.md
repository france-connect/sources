# Tracking

## À propos

Cette librairie sert à gérer les traces métiers des applications.

Elle fournit un socle exploitable par les applications, mais ces dernières doivent injecter des comportement spécifiques lors de l'import du module.

En effet chaque application va avoir des besoins qui lui sont propres, tant au niveau des événements journalisés, que des informations présentes dans chaque entrée de journal.

**Exemples de besoins spécifiques**

> `core-fcp` a besoin de systèmatiquement journaliser un identifiant d'interaction  
> `fc-exploitation` n'a pas cette notion  
> `fc-exploitation` a parfois besoin de journaliser un numéro de ticket OTRS

## Utilisation

### Initialisation

Le module est dynamique est doit être instancié avec la méthode `register`, qui prend en paramètre une classe de service étendant la classe l'interface [`AppTrackingServiceAbstract`](src/interfaces/app-tracking-service.abstract.ts)

```typescript
// Le présent module
import { TrackingModule } from '@fc/tracking';
// Le service spécifique implémentant l'interface IAppTrackingService
import { MyAppTrackingService } from './services';
// Une dépendance de MyAppTrackingService (à titre d'exmple)
import { MySpecificDependencyService } from '@fc/my-dependency';

@Module({
  imports: [
    // Import dynamique en passant en paramètre la class
    // contenant la logique spécifique
    TrackingModule.forRoot(MyAppTrackingService),
  ],
  exports: [
    // Il faut exporter les dépendances de MyAppTrackingService
    // Afin que le TrackingModule puisse l'instancier
    MySpecificDependencyService,
  ]
})
```

### Implémentation du `AppTrackingService`

#### Typage des log

Chaque application doit définir sa propre interface (ou classe abstraite) étendant `TrackingLogInterface`, avec les propriétés à journaliser pour cette application.

L'interface de base contient déjà les propriétés suivantes, requises :

- ip: string
- source: ISource
- category: string
- event: string

ISource:

- address: string
- port: string
- original_addresses: string

**Exemple d'interface spécifique à l'application**

```typescript
import { TrackingLogInterface } from '@fc/tracking';

export class IMyAppTrackingLog extends TrackingLogInterface {
  readonly interactionId: string;
}
```

La méthode [`buildLog`](src/interfaces/app-tracking-service.abstract.ts) doit renvoyer une promesse qui résoudra un objet implémentant l'interface [`TrackingLogInterface`](src/interfaces/tracking-log.interface.ts).

C'est cet objet qui sera ajouté au journal.

**Exemple d'implémentation du AppTrackingService**

```typescript
import { Injectable } from '@nestjs/common';
// Interfaces exposées par @fc/tracking
import {
  TrackedEvent,
  TrackedEventContext,
  AppTrackingServiceAbstract,
} from '@fc/tracking';
// Mapping des événements de l'application
import { EventsMap } from '../events.map';
// Interface spécifique définie précédement
import { IMyAppTrackingLog } from '../interfaces';

@Injectable()
export class MyAppTrackingService extends AppTrackingServiceAbstract {

  // Méthode a implémenter
  async buildLog(
    trackedEvent: TrackedEventInterface,
    context: TrackedEventContextInterface,
  ): Promise<IMyAppTrackingLog> {
    // Votre implémentation spécifique...
  };
```

#### Mapping des événements

La librairie `@fc/tracking` doit être configurée avec un mapping des évènements métiers pouvant être inscrits dans le journal.  
Ce mapping est typé par le type [`TrackedEventMapType`](src/interfaces/tracked-event-map.interface.ts) exposée par `@fc/tracking`, voir la définition de ce dernier pour le formalisme.

Le mapping des évènements est exposé via la propriété `TrackingService.TrackedEventMap`.

### Interceptor

La librairie contient et active un [`Interceptor`](src/interceptors/tracking.interceptor.ts) NestJS qui va automatiquement journaliser les événements configurés dans le mapping avec la propriété ̀`interceptRoutes`.

> NB: Les évènements journalisés de cette manière reçoivent un contexte générique.
